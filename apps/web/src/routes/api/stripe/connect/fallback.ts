import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";
import { eq, and } from "drizzle-orm";

import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { encrypt } from "@/lib/stripe/encryption";
import { setupWebhooks } from "@/lib/stripe/webhooks";

export const Route = createFileRoute("/api/stripe/connect/fallback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state"); // userId
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        const baseUrl = env.APP_URL;

        if (error) {
          console.error(
            `❌ Stripe OAuth Error: ${error} - ${errorDescription}`,
          );
          return Response.redirect(
            `${baseUrl}/onboarding?error=stripe_connection_failed&reason=${error}`,
          );
        }

        if (!code || !state) {
          return Response.redirect(
            `${baseUrl}/onboarding?error=stripe_connection_failed&reason=missing_params`,
          );
        }

        const userId = state;

        try {
          const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: "2026-02-25.clover",
          });

          const response = await stripe.oauth.token({
            grant_type: "authorization_code",
            code,
          });

          if (!response.stripe_user_id || !response.access_token) {
            console.error("❌ Missing stripe_user_id or access_token in response");
            return Response.redirect(
              `${baseUrl}/onboarding?error=stripe_connection_failed&reason=invalid_response`,
            );
          }

          // Deactivate any existing connection for this user
          await db
            .update(stripeConnection)
            .set({ isActive: false })
            .where(
              and(
                eq(stripeConnection.userId, userId),
                eq(stripeConnection.isActive, true),
              ),
            );

          // Store the new connection with encrypted token
          await db.insert(stripeConnection).values({
            userId,
            stripeAccountId: response.stripe_user_id,
            accessToken: encrypt(response.access_token),
            isActive: true,
          });

          console.log(
            `✅ Stripe connected for user ${userId}: ${response.stripe_user_id}`,
          );

          // Setup webhooks for this account
          await setupWebhooks(response.stripe_user_id);

          return Response.redirect(`${baseUrl}/dashboard?stripe=connected`);
        } catch (err) {
          console.error("❌ Stripe OAuth token exchange failed:", err);
          return Response.redirect(
            `${baseUrl}/onboarding?error=stripe_connection_failed&reason=token_exchange_failed`,
          );
        }
      },
    },
  },
});
