"use server";

import Stripe from "stripe";
import { eq, and } from "drizzle-orm";
import { db } from "@dunlo/db";
import { stripeConnection, users } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { encrypt, decrypt } from "@/lib/stripe/encryption";
import {
  deleteWebhooks,
  setupWebhooksForDirectAccount,
} from "@/lib/stripe/webhooks";
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
    const isApiKeyConnection = connection.stripeAccountId === "acct_api_key";
    if (isApiKeyConnection && connection.accessToken) {
      await deleteWebhooks(connection.webhookEndpointId, {
        userSecretKey: decrypt(connection.accessToken),
      });
    } else if (connection.stripeAccountId) {
      await deleteWebhooks(connection.webhookEndpointId, {
        stripeAccountId: connection.stripeAccountId,
      });
    } else {
      await deleteWebhooks(connection.webhookEndpointId);
    }
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
  timezone?: string;
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
      ...(data.timezone != null && { timezone: data.timezone }),
    })
    .where(eq(users.id, session.user.id));

  return { success: true };
}

export async function connectStripeWithApiKey(secretKey: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const trimmed = secretKey.trim();
  if (!trimmed.startsWith("sk_")) {
    throw new Error("Invalid key format. Use sk_live_xxx or sk_test_xxx");
  }

  try {
    const stripe = new Stripe(trimmed, {
      apiVersion: "2026-02-25.clover",
    });
    await stripe.balance.retrieve();
  } catch {
    throw new Error("Invalid or inactive Stripe key. Please check your key.");
  }

  const stripe = new Stripe(trimmed, {
    apiVersion: "2026-02-25.clover",
  });

  let stripeAccountId: string | null = null;
  try {
    const accounts = await stripe.accounts.list({ limit: 1 });
    stripeAccountId = accounts.data[0]?.id ?? null;
  } catch {
    stripeAccountId = "acct_api_key";
  }

  await db
    .update(stripeConnection)
    .set({ isActive: false })
    .where(
      and(
        eq(stripeConnection.userId, session.user.id),
        eq(stripeConnection.isActive, true),
      ),
    );

  const [connection] = await db
    .insert(stripeConnection)
    .values({
      userId: session.user.id,
      stripeAccountId,
      accessToken: encrypt(trimmed),
      isActive: true,
    })
    .returning();

  if (connection) {
    await setupWebhooksForDirectAccount(stripe, connection.id);
  }

  return { success: true };
}

export async function runOnboardingVerification(timezone: string) {
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
    throw new Error("No Stripe connection");
  }

  const { importRecentFailedPayments } = await import(
    "@/lib/stripe/import-failed-payments"
  );

  const { imported } = await importRecentFailedPayments(
    session.user.id,
    connection,
    { limit: 3, timezone },
  );

  return {
    stripeConnected: true,
    webhookRegistered: !!connection.webhookEndpointId,
    failedPaymentsImported: imported,
  };
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
    notificationEmail: user.notificationEmail ?? user.email ?? "",
    timezone: user.timezone ?? "UTC",
  };
}
