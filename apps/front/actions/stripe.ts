"use server";

import Stripe from "stripe";
import { eq, and, desc } from "drizzle-orm";
import { db } from "@dunlo/db";
import { stripeConnection, users } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { encrypt, decrypt } from "@/lib/stripe/encryption";
import {
  deleteWebhooks,
  setupWebhooksForDirectAccount,
} from "@/lib/stripe/webhooks";
import { getConnectedStripeClient } from "@/lib/stripe/client";
import {
  handlePaymentFailed,
  handlePaymentSucceeded,
} from "@/lib/stripe/handle-payment-events";
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
      await deleteWebhooks(
        connection.webhookEndpointId,
        decrypt(connection.accessToken),
        connection.stripeAccountId || "",
      );
    } else if (connection.stripeAccountId) {
      await deleteWebhooks(
        connection.webhookEndpointId,
        decrypt(connection.accessToken || ""),
        connection.stripeAccountId || "",
      );
    } else {
      await deleteWebhooks(
        connection.webhookEndpointId,
        decrypt(connection.accessToken || ""),
        connection.stripeAccountId || "",
      );
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

  const { importRecentFailedPayments } =
    await import("@/lib/stripe/import-failed-payments");

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

const STRIPE_TEST_DECLINING_PAYMENT_METHOD = "pm_card_visa_chargeDeclined";
const STRIPE_TEST_SUCCESS_PAYMENT_METHOD = "pm_card_visa";

export async function simulatePaymentFailed() {
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

  if (!connection?.accessToken) {
    throw new Error("No Stripe connection");
  }

  const rawToken = decrypt(connection.accessToken);
  if (!rawToken.startsWith("sk_test_")) {
    throw new Error(
      "La simulation n'est possible qu'en mode test Stripe (sk_test_).",
    );
  }

  const settings = await getUserSettings();
  const customerEmail =
    settings.notificationEmail || session.user.email || "test@example.com";

  const stripe = getConnectedStripeClient(connection.accessToken, {
    alreadyDecrypted: false,
  });

  const customer = await stripe.customers.create({
    email: customerEmail,
    name: "Test Customer (simulation)",
    metadata: { dunlo_sim: "true" },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 20000,
    currency: "eur",
    customer: customer.id,
    payment_method_types: ["card"],
    metadata: { dunlo_sim: "true" },
  });

  let failedPaymentIntent: Stripe.PaymentIntent;
  try {
    await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: STRIPE_TEST_DECLINING_PAYMENT_METHOD,
    });
    throw new Error("Expected card decline, but confirmation succeeded");
  } catch (err) {
    const stripeError = err as {
      payment_intent?: Stripe.PaymentIntent | string;
    };
    const rawPi = stripeError?.payment_intent;
    if (rawPi) {
      failedPaymentIntent =
        typeof rawPi === "string"
          ? await stripe.paymentIntents.retrieve(rawPi)
          : rawPi;
    } else {
      throw err;
    }
  }

  await handlePaymentFailed(
    failedPaymentIntent,
    session.user.id,
    { accessToken: connection.accessToken },
    { timezone: settings.timezone ?? "UTC" },
  );

  return {
    success: true,
    paymentIntentId: failedPaymentIntent.id,
    customerEmail,
    message: `Simulation créée sur Stripe. L'email J+0 sera envoyé à ${customerEmail}.`,
  };
}

export async function simulatePaymentRecovered() {
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

  if (!connection?.accessToken) {
    throw new Error("No Stripe connection");
  }

  const rawToken = decrypt(connection.accessToken);
  if (!rawToken.startsWith("sk_test_")) {
    throw new Error(
      "La simulation n'est possible qu'en mode test Stripe (sk_test_).",
    );
  }

  const { failedPayments } = await import("@dunlo/db/schema");
  const [recentFailed] = await db.query.failedPayments.findMany({
    where: and(
      eq(failedPayments.userId, session.user.id),
      eq(failedPayments.status, "emailing"),
    ),
    orderBy: [desc(failedPayments.detectedAt)],
    limit: 1,
  });

  if (!recentFailed) {
    throw new Error(
      "Aucun paiement échoué en cours. Simule d'abord un paiement échoué.",
    );
  }

  const stripe = getConnectedStripeClient(connection.accessToken);
  const paymentIntent = await stripe.paymentIntents.retrieve(
    recentFailed.stripePaymentIntentId,
  );

  if (
    paymentIntent.status !== "requires_payment_method" &&
    paymentIntent.status !== "requires_confirmation"
  ) {
    throw new Error(
      `Ce paiement n'est pas réessayable (statut: ${paymentIntent.status}).`,
    );
  }

  await stripe.paymentIntents.confirm(recentFailed.stripePaymentIntentId, {
    payment_method: STRIPE_TEST_SUCCESS_PAYMENT_METHOD,
  });

  const succeededPi = await stripe.paymentIntents.retrieve(
    recentFailed.stripePaymentIntentId,
  );

  await handlePaymentSucceeded(succeededPi, session.user.id);

  return {
    success: true,
    paymentIntentId: recentFailed.stripePaymentIntentId,
    message: `Paiement ${recentFailed.stripePaymentIntentId} marqué comme récupéré. Les emails J+3 et J+7 sont annulés.`,
  };
}

export async function simulateEscalation() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const settings = await getUserSettings();
  const customerEmail =
    settings.notificationEmail || session.user.email || "test@example.com";

  const { failedPayments, escalations } = await import("@dunlo/db/schema");

  const piId = `pi_sim_escalation_${crypto.randomUUID()}`;
  const amount = Math.max((settings.escalationThreshold ?? 200) * 100, 50000);

  const [payment] = await db
    .insert(failedPayments)
    .values({
      userId: session.user.id,
      stripePaymentIntentId: piId,
      stripeCustomerId: "cus_sim_escalation",
      customerEmail,
      customerName: "Test Customer (simulation)",
      amount,
      currency: "eur",
      failureReason: "card_declined",
      productName: "Abonnement Premium (simulation)",
      status: "escalated",
    })
    .returning();

  if (!payment) {
    throw new Error("Failed to create test payment");
  }

  await db.insert(escalations).values({
    failedPaymentId: payment.id,
    userId: session.user.id,
    reason: `Simulation : montant ${amount / 100}€ > seuil. 3 emails envoyés, pas de réponse.`,
  });

  return {
    success: true,
    message: `Escalade test créée. Va sur la page Escalations pour la voir.`,
  };
}
