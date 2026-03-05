import { createServerFn } from "@tanstack/react-start";
import { eq, and } from "drizzle-orm";

import { authMiddleware } from "@/middleware/auth";
import { db } from "@dunlo/db";
import { stripeConnection, users } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { deleteWebhooks } from "@/lib/stripe/webhooks";

/**
 * Generate Stripe OAuth Connect URL
 */
export const getStripeConnectUrl = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const userId = context.session.user.id;

    const params = new URLSearchParams({
      response_type: "code",
      client_id: env.STRIPE_CLIENT_ID,
      scope: "read_write",
      redirect_uri: `${env.APP_URL}/api/stripe/connect/fallback`,
      state: userId,
    });

    return {
      url: `https://connect.stripe.com/oauth/authorize?${params.toString()}`,
    };
  });

/**
 * Get user's Stripe connection status
 */
export const getStripeConnectionStatus = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const connection = await db.query.stripeConnection.findFirst({
      where: and(
        eq(stripeConnection.userId, context.session.user.id),
        eq(stripeConnection.isActive, true),
      ),
    });

    return {
      isConnected: !!connection,
      stripeAccountId: connection?.stripeAccountId ?? null,
      connectedAt: connection?.connectedAt?.toISOString() ?? null,
    };
  });

/**
 * Disconnect Stripe account
 */
export const disconnectStripe = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const connection = await db.query.stripeConnection.findFirst({
      where: and(
        eq(stripeConnection.userId, context.session.user.id),
        eq(stripeConnection.isActive, true),
      ),
    });

    if (!connection) {
      throw new Error("No active Stripe connection");
    }

    if (connection.webhookEndpointId) {
      await deleteWebhooks(connection.webhookEndpointId);
    }

    await db
      .update(stripeConnection)
      .set({ isActive: false })
      .where(eq(stripeConnection.id, connection.id));

    return { success: true };
  });

/**
 * Update user settings (escalation threshold + notification email)
 */
export const updateUserSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: { escalationThreshold: number; notificationEmail: string }) => d)
  .handler(async ({ context, data }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    await db
      .update(users)
      .set({
        escalationThreshold: data.escalationThreshold,
        notificationEmail: data.notificationEmail,
      })
      .where(eq(users.id, context.session.user.id));

    return { success: true };
  });

/**
 * Get user settings
 */
export const getUserSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, context.session.user.id),
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      escalationThreshold: user.escalationThreshold ?? 200,
      notificationEmail: user.notificationEmail ?? user.email,
    };
  });
