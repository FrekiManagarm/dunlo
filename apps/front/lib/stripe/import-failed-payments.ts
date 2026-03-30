import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@dunlo/db";
import {
  failedPayments,
  emailSequences,
} from "@dunlo/db/schema";
import { decrypt } from "./encryption";
import { getConnectedStripeClient } from "./client";
import { nextSendWindow } from "@/lib/recovery/schedule";
import { tasks } from "@trigger.dev/sdk/v3";
import { useLogger } from "@/lib/evlog";

const FAILED_STATUSES = ["requires_payment_method", "requires_action"] as const;

export async function importRecentFailedPayments(
  userId: string,
  connection: {
    accessToken: string | null;
    id: string;
  },
  options: { limit?: number; timezone?: string } = {},
): Promise<{ imported: number; total: number }> {
  const { limit = 3, timezone = "UTC" } = options;

  if (!connection.accessToken) return { imported: 0, total: 0 };

  const log = useLogger();
  let rawToken: string;
  try {
    rawToken = decrypt(connection.accessToken);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    log.set({ stripe: { import: { connectionId: connection.id, decryptError: error.message } } });
    return { imported: 0, total: 0 };
  }

  const stripe = getConnectedStripeClient(rawToken, { alreadyDecrypted: true });

  let paymentIntents: Stripe.PaymentIntent[] = [];
  try {
    const list = await stripe.paymentIntents.list({
      limit: 50,
      created: {
        gte: Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60,
      },
    });

    paymentIntents = list.data.filter(
      (pi) =>
        FAILED_STATUSES.includes(pi.status as (typeof FAILED_STATUSES)[number]) &&
        (pi.last_payment_error != null || pi.status === "requires_payment_method"),
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    log.set({ stripe: { import: { connectionId: connection.id, listError: error.message } } });
    return { imported: 0, total: 0 };
  }

  const toImport = paymentIntents.slice(0, limit);
  let imported = 0;

  for (const pi of toImport) {
    const existing = await db.query.failedPayments.findFirst({
      where: eq(failedPayments.stripePaymentIntentId, pi.id),
    });
    if (existing) continue;

    const stripeCustomerId =
      typeof pi.customer === "string" ? pi.customer : pi.customer?.id ?? null;

    let customerEmail = "unknown@unknown.com";
    let customerName = "Unknown";

    if (pi.customer) {
      try {
        const customer = await stripe.customers.retrieve(
          typeof pi.customer === "string" ? pi.customer : pi.customer.id,
        );
        if (!("deleted" in customer) || !customer.deleted) {
          customerEmail = customer.email ?? customerEmail;
          customerName = customer.name ?? customerEmail;
        }
      } catch {
        // ignore
      }
    }

    const failureReason =
      (pi.last_payment_error?.decline_code ??
        pi.last_payment_error?.code ??
        "unknown") as string;

    const now = new Date();
    const [newPayment] = await db
      .insert(failedPayments)
      .values({
        userId,
        stripePaymentIntentId: pi.id,
        stripeCustomerId,
        customerEmail,
        customerName,
        amount: pi.amount,
        currency: pi.currency,
        failureReason,
        status: "emailing",
      })
      .returning();

    if (!newPayment) continue;

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

    if (firstSeqId) {
      await tasks.trigger("send-recovery-email", {
        emailSequenceId: firstSeqId,
      });
    }

    imported++;
  }

  return { imported, total: toImport.length };
}
