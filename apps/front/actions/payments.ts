"use server";

import { eq, and, sql, desc } from "drizzle-orm";
import { db } from "@dunlo/db";
import {
  failedPayments,
  emailSequences,
  escalations,
} from "@dunlo/db/schema";
import { getSession } from "./auth";

export async function getDashboardData() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const payments = await db.query.failedPayments.findMany({
    where: eq(failedPayments.userId, userId),
    with: { emailSequences: true },
    orderBy: [desc(failedPayments.detectedAt)],
  });

  const atRisk = payments
    .filter((p) => p.status !== "recovered" && p.status !== "lost")
    .reduce((sum, p) => sum + p.amount, 0);

  const recoveredThisMonth = payments
    .filter((p) => {
      if (p.status !== "recovered" || !p.recoveredAt) return false;
      const now = new Date();
      return (
        p.recoveredAt.getMonth() === now.getMonth() &&
        p.recoveredAt.getFullYear() === now.getFullYear()
      );
    })
    .reduce((sum, p) => sum + p.amount, 0);

  const needsAttention = payments.filter((p) => p.status === "escalated")
    .length;

  const tablePayments = payments.map((p) => {
    const sentEmails = p.emailSequences.filter(
      (e) =>
        e.status === "sent" ||
        e.status === "opened" ||
        e.status === "clicked",
    ).length;

    return {
      id: p.id,
      customerName: p.customerName,
      customerEmail: p.customerEmail,
      amount: p.amount,
      currency: p.currency,
      status: p.status,
      currentStep: sentEmails,
      totalSteps: 3,
      failureReason: p.failureReason,
      detectedAt: p.detectedAt.toISOString(),
    };
  });

  return {
    stats: { atRisk, recoveredThisMonth, needsAttention },
    payments: tablePayments,
  };
}

export async function getEscalations() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const activeEscalations = await db.query.escalations.findMany({
    where: and(
      eq(escalations.userId, userId),
      sql`${escalations.resolvedAt} IS NULL`,
    ),
    with: {
      failedPayment: {
        with: { emailSequences: true },
      },
    },
    orderBy: [desc(escalations.triggeredAt)],
  });

  return activeEscalations
    .filter((esc) => esc.failedPayment != null)
    .map((esc) => {
      const payment = esc.failedPayment!;
      const emailsSent = payment.emailSequences.filter(
        (e) =>
          e.status === "sent" ||
          e.status === "opened" ||
          e.status === "clicked",
      ).length;
      const daysSince = Math.floor(
        (Date.now() - esc.triggeredAt.getTime()) / (1000 * 60 * 60 * 24),
      );

      return {
        id: esc.id,
        paymentId: payment.id,
        customerName: payment.customerName,
        customerEmail: payment.customerEmail,
        amount: payment.amount,
        currency: payment.currency,
        emailsSent,
        daysSince,
        reason: esc.reason,
        sequenceComplete: emailsSent >= 3,
      };
    });
}

export async function getPaymentDetail(id: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const payment = await db.query.failedPayments.findFirst({
    where: and(
      eq(failedPayments.id, id),
      eq(failedPayments.userId, session.user.id),
    ),
    with: {
      emailSequences: {
        orderBy: [sql`${emailSequences.step} ASC`],
      },
      escalations: true,
    },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const sentEmails = payment.emailSequences.filter(
    (e) =>
      e.status === "sent" || e.status === "opened" || e.status === "clicked",
  ).length;
  const daysSinceDetection = Math.floor(
    (Date.now() - payment.detectedAt.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    id: payment.id,
    stripePaymentIntentId: payment.stripePaymentIntentId,
    customerName: payment.customerName,
    customerEmail: payment.customerEmail,
    amount: payment.amount,
    currency: payment.currency,
    failureReason: payment.failureReason,
    status: payment.status,
    currentStep: sentEmails,
    totalSteps: 3,
    detectedAt: payment.detectedAt.toISOString(),
    recoveredAt: payment.recoveredAt?.toISOString() ?? null,
    daysSinceDetection,
    timeline: payment.emailSequences.map((e) => ({
      step: e.step,
      label:
        e.step === 1
          ? "Recovery email"
          : e.step === 2
            ? "Follow-up email"
            : "Final reminder",
      scheduledAt: e.scheduledAt.toISOString(),
      sentAt: e.sendAt?.toISOString() ?? null,
      openedAt: e.openedAt?.toISOString() ?? null,
      status: e.status,
    })),
    isEscalated: payment.escalations.length > 0,
  };
}

export async function markPaymentResolved(paymentId: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await db
    .update(failedPayments)
    .set({
      status: "recovered",
      recoveredAt: new Date(),
    })
    .where(
      and(
        eq(failedPayments.id, paymentId),
        eq(failedPayments.userId, session.user.id),
      ),
    );

  await db
    .update(emailSequences)
    .set({ status: "sent" })
    .where(
      and(
        eq(emailSequences.failedPaymentId, paymentId),
        eq(emailSequences.status, "pending"),
      ),
    );

  await db
    .update(escalations)
    .set({ resolvedAt: new Date() })
    .where(
      and(
        eq(escalations.failedPaymentId, paymentId),
        sql`${escalations.resolvedAt} IS NULL`,
      ),
    );

  return { success: true };
}

export async function escalatePayment(paymentId: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existing = await db.query.escalations.findFirst({
    where: and(
      eq(escalations.failedPaymentId, paymentId),
      sql`${escalations.resolvedAt} IS NULL`,
    ),
  });

  if (existing) {
    return { success: true, alreadyEscalated: true };
  }

  await db.insert(escalations).values({
    failedPaymentId: paymentId,
    userId,
    reason: "Manually escalated by founder",
  });

  await db
    .update(failedPayments)
    .set({ status: "escalated" })
    .where(eq(failedPayments.id, paymentId));

  return { success: true, alreadyEscalated: false };
}

export async function resolveEscalation(escalationId: string) {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const esc = await db.query.escalations.findFirst({
    where: and(
      eq(escalations.id, escalationId),
      eq(escalations.userId, session.user.id),
    ),
  });

  if (!esc) {
    throw new Error("Escalation not found");
  }

  await db
    .update(escalations)
    .set({ resolvedAt: new Date() })
    .where(eq(escalations.id, escalationId));

  if (esc.failedPaymentId) {
    await db
      .update(failedPayments)
      .set({
        status: "recovered",
        recoveredAt: new Date(),
      })
      .where(eq(failedPayments.id, esc.failedPaymentId));
  }

  return { success: true };
}
