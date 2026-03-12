import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@dunlo/db";
import { failedPayments, emailSequences } from "@dunlo/db/schema";
import { getStripeClient, getConnectedStripeClient } from "./client";
import { decrypt } from "./encryption";
import { nextSendWindow } from "@/lib/recovery/schedule";
import { tasks } from "@trigger.dev/sdk/v3";

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
      ? getConnectedStripeClient(decrypt(connection.accessToken))
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

  console.log(`🚨 New failed payment detected: ${newPayment.id} (${failureReason})`);

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
    await tasks.trigger("send-recovery-email", {
      emailSequenceId: firstSeqId,
    });
  }

  console.log(`📧 Scheduled 3 recovery emails for payment ${newPayment.id}, J+0 triggered`);
}
