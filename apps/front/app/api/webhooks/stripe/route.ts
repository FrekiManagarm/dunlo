import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { eq, and } from "drizzle-orm";
import { db } from "@dunlo/db";
import {
  failedPayments,
  emailSequences,
  stripeConnection,
} from "@dunlo/db/schema";
import { getStripeClient, getConnectedStripeClient, constructWebhookEvent } from "@/lib/stripe/client";
import { decrypt } from "@/lib/stripe/encryption";
import { nextSendWindow } from "@/lib/recovery/schedule";
import { tasks } from "@trigger.dev/sdk/v3";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const connections = await db.query.stripeConnection.findMany({
    where: eq(stripeConnection.isActive, true),
  });

  let event: Stripe.Event | null = null;
  let matchedConnection: (typeof connections)[number] | null = null;

  for (const conn of connections) {
    if (!conn.webhookSecret) continue;
    try {
      const secret = decrypt(conn.webhookSecret);
      event = constructWebhookEvent(body, signature, secret);
      matchedConnection = conn;
      break;
    } catch {
      // Signature didn't match, try next
    }
  }

  if (!event || !matchedConnection) {
    console.error("❌ No matching webhook secret found");
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  const userId = matchedConnection.userId!;

  try {
    switch (event.type) {
      case "payment_intent.payment_failed":
        await handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
          userId,
          matchedConnection,
        );
        break;
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          userId,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          userId,
        );
        break;
      case "invoice.payment_action_required":
        await handlePaymentActionRequired(
          event.data.object as Stripe.Invoice,
          userId,
          matchedConnection,
        );
        break;
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`❌ Error processing webhook ${event.type}:`, error);
    return new Response("Webhook handler error", { status: 500 });
  }
}

async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
  connection: (typeof stripeConnection.$inferSelect) & { accessToken: string | null },
) {
  const stripe =
    connection.accessToken != null
      ? getConnectedStripeClient(decrypt(connection.accessToken!))
      : getStripeClient();

  const stripeCustomerId =
    typeof paymentIntent.customer === "string"
      ? paymentIntent.customer
      : paymentIntent.customer?.id ?? null;

  let customerEmail = "unknown@unknown.com";
  let customerName = "Unknown";

  if (paymentIntent.customer) {
    try {
      const customer = await stripe.customers.retrieve(
        paymentIntent.customer as string,
      );
      if (!customer.deleted) {
        customerEmail = customer.email ?? customerEmail;
        customerName = customer.name ?? customerEmail;
      }
    } catch {
      // ignore
    }
  }

  const failureReason =
    (paymentIntent.last_payment_error?.decline_code ??
      paymentIntent.last_payment_error?.code ??
      "unknown") as string;

  const existing = await db.query.failedPayments.findFirst({
    where: eq(failedPayments.stripePaymentIntentId, paymentIntent.id),
  });

  if (existing) {
    console.log(`ℹ️ Payment ${paymentIntent.id} already tracked, skipping`);
    return;
  }

  const now = new Date();
  const [newPayment] = await db
    .insert(failedPayments)
    .values({
      userId,
      stripePaymentIntentId: paymentIntent.id,
      stripeCustomerId,
      customerEmail,
      customerName,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      failureReason,
      status: "emailing",
    })
    .returning();

  console.log(`🚨 New failed payment detected: ${newPayment.id} (${failureReason})`);

  const steps = [
    { step: 1, delayDays: 0 },
    { step: 2, delayDays: 3 },
    { step: 3, delayDays: 7 },
  ];

  let firstSeqId: string | null = null;

  for (const { step, delayDays } of steps) {
    const scheduledAt = nextSendWindow(now, delayDays, "UTC");

    const [seq] = await db
      .insert(emailSequences)
      .values({
        failedPaymentId: newPayment.id,
        step,
        scheduledAt,
        sendAt: scheduledAt,
        status: "pending",
      })
      .returning({ id: emailSequences.id });

    if (step === 1) firstSeqId = seq?.id ?? null;
  }

  if (firstSeqId != null) {
    await tasks.trigger("send-recovery-email", {
      emailSequenceId: firstSeqId,
    });
  }

  console.log(`📧 Scheduled 3 recovery emails for payment ${newPayment.id}, J+0 triggered`);
}

async function handlePaymentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
) {
  const existing = await db.query.failedPayments.findFirst({
    where: and(
      eq(failedPayments.stripePaymentIntentId, paymentIntent.id),
      eq(failedPayments.userId, userId),
    ),
  });

  if (!existing) return;
  if (existing.status === "recovered" || existing.status === "lost") return;

  await db
    .update(failedPayments)
    .set({ status: "recovered", recoveredAt: new Date() })
    .where(eq(failedPayments.id, existing.id));

  await db
    .update(emailSequences)
    .set({ status: "cancelled" })
    .where(
      and(
        eq(emailSequences.failedPaymentId, existing.id),
        eq(emailSequences.status, "pending"),
      ),
    );

  console.log(`✅ Payment ${paymentIntent.id} recovered!`);
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  userId: string,
) {
  const stripe = getStripeClient();
  const customerId = subscription.customer as string;
  let customerEmail: string | null = null;

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted) {
      customerEmail = customer.email;
    }
  } catch {
    // ignore
  }

  if (!customerEmail) return;

  const activePayments = await db.query.failedPayments.findMany({
    where: and(
      eq(failedPayments.userId, userId),
      eq(failedPayments.customerEmail, customerEmail),
    ),
  });

  for (const payment of activePayments) {
    if (payment.status === "recovered" || payment.status === "lost") continue;

    await db
      .update(failedPayments)
      .set({ status: "lost" })
      .where(eq(failedPayments.id, payment.id));

    await db
      .update(emailSequences)
      .set({ status: "cancelled" })
      .where(
        and(
          eq(emailSequences.failedPaymentId, payment.id),
          eq(emailSequences.status, "pending"),
        ),
      );
  }

  console.log(`💀 Subscription deleted for ${customerEmail}, marked as lost`);
}

async function handlePaymentActionRequired(
  invoice: Stripe.Invoice,
  userId: string,
  connection: (typeof stripeConnection.$inferSelect) & { accessToken: string | null },
) {
  const stripe =
    connection.accessToken != null
      ? getConnectedStripeClient(decrypt(connection.accessToken))
      : getStripeClient();

  const invoiceAny = invoice as unknown as Record<string, unknown>;
  const rawPI = invoiceAny.payment_intent;
  const paymentIntentId =
    typeof rawPI === "string"
      ? rawPI
      : rawPI && typeof rawPI === "object" && "id" in rawPI
        ? (rawPI as { id: string }).id
        : null;

  if (!paymentIntentId) return;

  const existing = await db.query.failedPayments.findFirst({
    where: eq(failedPayments.stripePaymentIntentId, paymentIntentId),
  });

  if (existing) return;

  const stripeCustomerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id ?? null;

  let customerEmail = "unknown@unknown.com";
  let customerName = "Unknown";

  if (invoice.customer) {
    try {
      const customer = await stripe.customers.retrieve(
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer.id,
      );
      if (!customer.deleted) {
        customerEmail = customer.email ?? customerEmail;
        customerName = customer.name ?? customerEmail;
      }
    } catch {
      // ignore
    }
  }

  const now = new Date();
  const [newPayment] = await db
    .insert(failedPayments)
    .values({
      userId,
      stripePaymentIntentId: paymentIntentId,
      stripeCustomerId,
      customerEmail,
      customerName,
      amount: invoice.amount_due ?? 0,
      currency: invoice.currency ?? "eur",
      failureReason: "authentication_required",
      status: "emailing",
    })
    .returning();

  const steps = [
    { step: 1, delayDays: 0 },
    { step: 2, delayDays: 3 },
    { step: 3, delayDays: 7 },
  ];

  let firstSeqId: string | null = null;

  for (const { step, delayDays } of steps) {
    const scheduledAt = nextSendWindow(now, delayDays, "UTC");

    const [seq] = await db
      .insert(emailSequences)
      .values({
        failedPaymentId: newPayment.id,
        step,
        scheduledAt,
        sendAt: scheduledAt,
        status: "pending",
      })
      .returning({ id: emailSequences.id });

    if (step === 1) firstSeqId = seq?.id ?? null;
  }

  if (firstSeqId != null) {
    await tasks.trigger("send-recovery-email", {
      emailSequenceId: firstSeqId,
    });
  }

  console.log(`🔐 3DS required for ${paymentIntentId}, emails scheduled`);
}
