import { and, eq, lte } from "drizzle-orm";

import { db } from "@dunlo/db";
import {
  emailSequences,
  failedPayments,
  escalations,
  users,
} from "@dunlo/db/schema";
import { getResendClient } from "./client";
import { getEmailTemplate, getEscalationAlertTemplate } from "./templates";

function formatAmount(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Process all pending emails that are due to be sent.
 * Called by the cron endpoint.
 */
export async function processPendingEmails(): Promise<{
  sent: number;
  escalated: number;
  errors: number;
}> {
  const resend = getResendClient();
  let sent = 0;
  let escalated = 0;
  let errors = 0;

  const now = new Date();

  // Find all pending emails whose scheduledAt has passed
  const pendingEmails = await db.query.emailSequences.findMany({
    where: and(
      eq(emailSequences.status, "pending"),
      lte(emailSequences.scheduledAt, now),
    ),
    with: {
      failedPayment: true,
    },
  });

  for (const emailSeq of pendingEmails) {
    const payment = emailSeq.failedPayment;
    if (!payment) continue;

    // Skip if payment is already resolved
    if (payment.status === "recovered" || payment.status === "lost") {
      await db
        .update(emailSequences)
        .set({ status: "sent" })
        .where(eq(emailSequences.id, emailSeq.id));
      continue;
    }

    try {
      const template = getEmailTemplate(
        payment.failureReason,
        emailSeq.step,
        {
          customerName: payment.customerName,
          amount: formatAmount(payment.amount, payment.currency),
          currency: payment.currency,
        },
      );

      await resend.emails.send({
        from: "Dunlo <recovery@dunlo.io>",
        to: [payment.customerEmail],
        subject: template.subject,
        html: template.html,
      });

      await db
        .update(emailSequences)
        .set({
          status: "sent",
          sendAt: new Date(),
        })
        .where(eq(emailSequences.id, emailSeq.id));

      sent++;
      console.log(
        `📧 Sent step ${emailSeq.step} email to ${payment.customerEmail} for payment ${payment.id}`,
      );
    } catch (error) {
      console.error(
        `❌ Failed to send email for payment ${payment.id}:`,
        error,
      );
      errors++;
      continue;
    }

    // After step 3, check if escalation is needed
    if (emailSeq.step === 3) {
      await checkAndEscalate(payment.id, payment.userId!);
    }
  }

  return { sent, escalated, errors };
}

/**
 * After the full sequence (step 3), escalate if the payment is still unresolved
 * and the amount exceeds the user's threshold.
 */
async function checkAndEscalate(
  failedPaymentId: string,
  userId: string,
): Promise<boolean> {
  const payment = await db.query.failedPayments.findFirst({
    where: eq(failedPayments.id, failedPaymentId),
  });

  if (!payment) return false;
  if (payment.status === "recovered" || payment.status === "lost") return false;

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) return false;

  const thresholdCents = (user.escalationThreshold ?? 200) * 100;

  if (payment.amount < thresholdCents) {
    // Below threshold, don't escalate but mark as needing attention
    return false;
  }

  // Check if already escalated
  const existingEscalation = await db.query.escalations.findFirst({
    where: eq(escalations.failedPaymentId, failedPaymentId),
  });

  if (existingEscalation) return false;

  // Create escalation
  await db.insert(escalations).values({
    failedPaymentId,
    userId,
    reason: `Full email sequence completed. Payment of ${formatAmount(payment.amount, payment.currency)}/mo still unpaid after 7 days.`,
  });

  // Update payment status
  await db
    .update(failedPayments)
    .set({ status: "escalated" })
    .where(eq(failedPayments.id, failedPaymentId));

  // Send alert email to founder
  const notificationEmail = user.notificationEmail ?? user.email;
  const resend = getResendClient();

  const daysSinceDetection = Math.floor(
    (Date.now() - payment.detectedAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  const template = getEscalationAlertTemplate({
    customerName: payment.customerName,
    customerEmail: payment.customerEmail,
    amount: formatAmount(payment.amount, payment.currency),
    failureReason: payment.failureReason,
    daysSinceDetection,
    emailsSent: 3,
  });

  try {
    await resend.emails.send({
      from: "Dunlo Alerts <alerts@dunlo.io>",
      to: [notificationEmail],
      subject: template.subject,
      html: template.html,
    });
    console.log(
      `🚨 Escalated payment ${failedPaymentId} — alert sent to ${notificationEmail}`,
    );
  } catch (error) {
    console.error(`❌ Failed to send escalation alert:`, error);
  }

  return true;
}
