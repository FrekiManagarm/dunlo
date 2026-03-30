import { NextRequest } from "next/server";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { encrypt } from "@/lib/stripe/encryption";
import { setupWebhooks } from "@/lib/stripe/webhooks";
import { revalidatePath } from "next/cache";
import { useLogger, withEvlog } from "@/lib/evlog";

export const GET = withEvlog(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const logger = useLogger();

  const baseUrl = env.APP_URL || "https://dunlo.io";

  if (error) {
    logger.set({
      message: `❌ Stripe OAuth Error: ${error} - ${errorDescription}`,
      status: 500,
    });
    return Response.redirect(
      `${baseUrl}/onboarding?error=stripe_connection_failed&reason=${error}`,
    );
  }

  if (!code || !state) {
    logger.set({ message: "Failed to get code or state", status: 401 });
    return Response.redirect(
      `${baseUrl}/onboarding?error=stripe_connection_failed&reason=missing_params`,
    );
  }

  const userId = state;

  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    logger.set({ message: `🔄 Exchanging OAuth code for client ${state}` });

    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code,
    });

    logger.set({ message: `✅ Exchanged OAuth code for client ${state}` });

    if (!response.stripe_user_id || !response.access_token) {
      logger.set({
        message: "❌ Missing stripe_user_id or access_token in response",
      });
      return Response.redirect(
        `${baseUrl}/onboarding?error=stripe_connection_failed&reason=invalid_response`,
      );
    }

    const encryptedAccessToken = encrypt(response.access_token!);
    const encryptedRefreshToken = response.refresh_token
      ? encrypt(response.refresh_token!)
      : null;

    // Check if connection already exists for specific Stripe Account
    const existingConnection = await db.query.stripeConnection.findFirst({
      where: (connection, { and, eq }) =>
        and(
          eq(connection.userId, userId),
          eq(connection.stripeAccountId, response.stripe_user_id!),
        ),
    });

    let connectionId: string;

    if (existingConnection) {
      await db
        .update(stripeConnection)
        .set({
          accessToken: encryptedAccessToken,
          refreshToken: encryptedRefreshToken,
          isActive: true,
          lastSyncAt: new Date(),
        })
        .where(eq(stripeConnection.id, existingConnection.id));

      connectionId = existingConnection.id;

      revalidatePath(`/dashboard`);
      revalidatePath("/onboarding");

      logger.set({
        stripe: {
          connection: { id: connectionId, accountId: response.stripe_user_id, action: "updated" },
        },
      });
    } else {
      const [newConnection] = await db
        .insert(stripeConnection)
        .values({
          userId: state as string,
          stripeAccountId: response.stripe_user_id!,
          accessToken: encryptedAccessToken,
          isActive: true,
        })
        .returning()
        .execute();

      connectionId = newConnection.id;
      logger.set({
        stripe: {
          connection: { id: connectionId, accountId: response.stripe_user_id, userId: state, action: "created" },
        },
      });
    }

    const webhookResult = await setupWebhooks(
      response.stripe_user_id,
      response.access_token,
    );

    logger.set({
      stripe: {
        webhook: { accountId: response.stripe_user_id, configured: !!webhookResult },
      },
    });

    return Response.redirect(`${baseUrl}/onboarding`);
  } catch (err) {
    logger.set({
      message: "❌ Missing stripe_user_id or access_token in response",
      err,
    });
    return Response.redirect(
      `${baseUrl}/onboarding?error=stripe_connection_failed&reason=token_exchange_failed`,
    );
  }
});
