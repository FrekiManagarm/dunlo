import type Stripe from "stripe";
import { and, eq } from "drizzle-orm";
import { db } from "@dunlo/db";
import {
  failedPayments,
  emailSequences,
  subscriptionEvents,
} from "@dunlo/db/schema";
import { getStripeClient, getConnectedStripeClient } from "./client";
import { nextSendWindow } from "@/lib/recovery/schedule";
import { sendRecoveryEmailTask } from "@/trigger/send-recovery-email";
import { useLogger } from "@/lib/evlog";

export type StripeConnectionForPaymentFailed = {
  accessToken: string | null;
};

export async function handlePaymentFailed(
  paymentIntent: Stripe.PaymentIntent,
  userId: string,
  connection: StripeConnectionForPaymentFailed,
  options?: { timezone?: string },
) {
  const stripe =
    connection.accessToken != null
      ? getConnectedStripeClient(connection.accessToken)
      : getStripeClient();

  const stripeCustomerId =
    typeof paymentIntent.customer === "string"
      ? paymentIntent.customer
      : (paymentIntent.customer?.id ?? null);

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

  const failureReason = (paymentIntent.last_payment_error?.decline_code ??
    paymentIntent.last_payment_error?.code ??
    "unknown") as string;

  const existing = await db.query.failedPayments.findFirst({
    where: eq(failedPayments.stripePaymentIntentId, paymentIntent.id),
  });

  const log = useLogger();

  if (existing) {
    log.set({ stripe: { payment: { id: paymentIntent.id, idempotent: true } } });
    return;
  }

  const now = new Date();
  const timezone = options?.timezone ?? "UTC";
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

  if (!newPayment) return;

  log.set({
    stripe: {
      payment: { id: newPayment.id, status: "detected", failureReason, customerEmail },
    },
  });

  const steps = [
    { step: 1, delayDays: 0 },
    { step: 2, delayDays: 3 },
    { step: 3, delayDays: 7 },
  ];

  let firstSeqId: string | null = null;

  for (const { step, delayDays } of steps) {
    const scheduledAt = nextSendWindow(now, delayDays, timezone);

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
    await sendRecoveryEmailTask.trigger({
      emailSequenceId: firstSeqId,
    });
  }

  log.set({ stripe: { payment: { id: newPayment.id, emailsScheduled: 3, j0Triggered: true } } });
}

export async function handlePaymentSucceeded(
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

  const log = useLogger();
  log.set({ stripe: { payment: { id: paymentIntent.id, status: "recovered" } } });
}

export async function handleSubscriptionDeleted(
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

  const log = useLogger();
  log.set({
    stripe: {
      subscription: {
        event: "deleted",
        customerEmail,
        paymentsLost: activePayments.filter(
          (p) => p.status !== "recovered" && p.status !== "lost",
        ).length,
      },
    },
  });
}

function getSubscriptionAmount(subscription: Stripe.Subscription): number {
  return subscription.items.data.reduce((sum, item) => {
    const unitAmount = item.price?.unit_amount ?? 0;
    const quantity = item.quantity ?? 1;
    return sum + unitAmount * quantity;
  }, 0);
}

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  previousAttributes: Partial<Stripe.Subscription>,
  userId: string,
) {
  if (!previousAttributes.items) return;

  const stripe = getStripeClient();
  const customerId = subscription.customer as string;
  let customerEmail = "unknown@unknown.com";

  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer.deleted) {
      customerEmail = customer.email ?? customerEmail;
    }
  } catch (e) {
    // ignore
  }

  const prevAmount = getSubscriptionAmount(
    previousAttributes as Stripe.Subscription,
  );
  const newAmount = getSubscriptionAmount(subscription);

  if (newAmount >= prevAmount) return;

  await db.insert(subscriptionEvents).values({
    userId,
    customerEmail,
    stripeSubscriptionId: subscription.id,
    type: "downgrade",
    previousAmount: prevAmount,
    newAmount,
    occurredAt: new Date(),
  });

  const log = useLogger();
  log.set({
    stripe: {
      subscription: { event: "downgrade", customerEmail, prevAmount, newAmount },
    },
  });
}

export async function handlePaymentActionRequired(
  invoice: Stripe.Invoice,
  userId: string,
  connection: { accessToken: string | null },
) {
  const stripe =
    connection.accessToken != null
      ? getConnectedStripeClient(connection.accessToken)
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
      : (invoice.customer?.id ?? null);

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
    await sendRecoveryEmailTask.trigger({
      emailSequenceId: firstSeqId,
    });
  }

  const log = useLogger();
  log.set({
    stripe: {
      payment: {
        id: paymentIntentId,
        failureReason: "authentication_required",
        emailsScheduled: 3,
        j0Triggered: true,
      },
    },
  });
}
