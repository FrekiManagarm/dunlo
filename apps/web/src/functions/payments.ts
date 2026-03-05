import { createServerFn } from "@tanstack/react-start";
import { eq, and, sql, desc } from "drizzle-orm";

import { authMiddleware } from "@/middleware/auth";
import { db } from "@dunlo/db";
import {
  failedPayments,
  emailSequences,
  escalations,
} from "@dunlo/db/schema";

/**
 * Get dashboard data: stats + recent failed payments
 */
export const getDashboardData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const userId = context.session.user.id;

    // Get all failed payments for this user
    const payments = await db.query.failedPayments.findMany({
      where: eq(failedPayments.userId, userId),
      with: {
        emailSequences: true,
      },
      orderBy: [desc(failedPayments.detectedAt)],
    });

    // Compute stats
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

    const needsAttention = payments.filter(
      (p) => p.status === "escalated",
    ).length;

    // Map payments for the table
    const tablePayments = payments.map((p) => {
      const sentEmails = p.emailSequences.filter(
        (e) => e.status === "sent" || e.status === "opened" || e.status === "clicked",
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
      stats: {
        atRisk,
        recoveredThisMonth,
        needsAttention,
      },
      payments: tablePayments,
    };
  });

/**
 * Get escalations list
 */
export const getEscalations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const userId = context.session.user.id;

    const activeEscalations = await db.query.escalations.findMany({
      where: and(
        eq(escalations.userId, userId),
        sql`${escalations.resolvedAt} IS NULL`,
      ),
      with: {
        failedPayment: {
          with: {
            emailSequences: true,
          },
        },
      },
      orderBy: [desc(escalations.triggeredAt)],
    });

    return activeEscalations
      .filter((esc) => esc.failedPayment != null)
      .map((esc) => {
        const payment = esc.failedPayment!;
        const emailsSent = payment.emailSequences.filter(
          (e) => e.status === "sent" || e.status === "opened" || e.status === "clicked",
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
  });

/**
 * Get payment detail by ID
 */
export const getPaymentDetail = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ context, data }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const payment = await db.query.failedPayments.findFirst({
      where: and(
        eq(failedPayments.id, data.id),
        eq(failedPayments.userId, context.session.user.id),
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
      (e) => e.status === "sent" || e.status === "opened" || e.status === "clicked",
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
  });

/**
 * Mark a payment as resolved
 */
export const markPaymentResolved = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: { paymentId: string }) => d)
  .handler(async ({ context, data }) => {
    if (!context.session?.user) {
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
          eq(failedPayments.id, data.paymentId),
          eq(failedPayments.userId, context.session.user.id),
        ),
      );

    // Cancel pending emails
    await db
      .update(emailSequences)
      .set({ status: "sent" })
      .where(
        and(
          eq(emailSequences.failedPaymentId, data.paymentId),
          eq(emailSequences.status, "pending"),
        ),
      );

    // Resolve any escalation
    await db
      .update(escalations)
      .set({ resolvedAt: new Date() })
      .where(
        and(
          eq(escalations.failedPaymentId, data.paymentId),
          sql`${escalations.resolvedAt} IS NULL`,
        ),
      );

    return { success: true };
  });

/**
 * Manually escalate a payment
 */
export const escalatePayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: { paymentId: string }) => d)
  .handler(async ({ context, data }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const userId = context.session.user.id;

    // Check if already escalated
    const existing = await db.query.escalations.findFirst({
      where: and(
        eq(escalations.failedPaymentId, data.paymentId),
        sql`${escalations.resolvedAt} IS NULL`,
      ),
    });

    if (existing) {
      return { success: true, alreadyEscalated: true };
    }

    await db.insert(escalations).values({
      failedPaymentId: data.paymentId,
      userId,
      reason: "Manually escalated by founder",
    });

    await db
      .update(failedPayments)
      .set({ status: "escalated" })
      .where(eq(failedPayments.id, data.paymentId));

    return { success: true, alreadyEscalated: false };
  });

/**
 * Resolve an escalation
 */
export const resolveEscalation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .inputValidator((d: { escalationId: string }) => d)
  .handler(async ({ context, data }) => {
    if (!context.session?.user) {
      throw new Error("Unauthorized");
    }

    const esc = await db.query.escalations.findFirst({
      where: and(
        eq(escalations.id, data.escalationId),
        eq(escalations.userId, context.session.user.id),
      ),
    });

    if (!esc) {
      throw new Error("Escalation not found");
    }

    await db
      .update(escalations)
      .set({ resolvedAt: new Date() })
      .where(eq(escalations.id, data.escalationId));

    // Mark payment as recovered
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
  });
