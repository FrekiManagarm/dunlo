"use server";

import { eq, and } from "drizzle-orm";
import { db } from "@dunlo/db";
import { stripeConnection, users } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { deleteWebhooks } from "@/lib/stripe/webhooks";
import { getSession } from "./auth";

export async function getStripeConnectUrl() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: env.STRIPE_CLIENT_ID,
    scope: "read_write",
    redirect_uri: `${env.APP_URL}/api/stripe/connect/fallback`,
    state: session.user.id,
  });

  return {
    url: `https://connect.stripe.com/oauth/authorize?${params.toString()}`,
  };
}

export async function getStripeConnectionStatus() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const connection = await db.query.stripeConnection.findFirst({
    where: and(
      eq(stripeConnection.userId, session.user.id),
      eq(stripeConnection.isActive, true),
    ),
  });

  return {
    isConnected: !!connection,
    stripeAccountId: connection?.stripeAccountId ?? null,
    connectedAt: connection?.connectedAt?.toISOString() ?? null,
  };
}

export async function disconnectStripe() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const connection = await db.query.stripeConnection.findFirst({
    where: and(
      eq(stripeConnection.userId, session.user.id),
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
}

export async function updateUserSettings(data: {
  escalationThreshold: number;
  notificationEmail: string;
}) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db
    .update(users)
    .set({
      escalationThreshold: data.escalationThreshold,
      notificationEmail: data.notificationEmail,
    })
    .where(eq(users.id, session.user.id));

  return { success: true };
}

export async function getUserSettings() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    escalationThreshold: user.escalationThreshold ?? 200,
    notificationEmail: user.notificationEmail ?? user.email,
  };
}
