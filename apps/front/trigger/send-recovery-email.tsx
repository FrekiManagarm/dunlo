import type React from "react";
import { logger, schemaTask } from "@trigger.dev/sdk/v3";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "@dunlo/db";
import { emailSequences, failedPayments, escalations, users } from "@dunlo/db/schema";
import { Resend } from "resend";
import { env } from "@dunlo/env/server";
import { createCardUpdateToken } from "../lib/recovery/token";
import { getJ0Message } from "../lib/recovery/messages";
import { RecoveryJ0 } from "../emails/recovery-j0";
import { RecoveryJ3 } from "../emails/recovery-j3";
import { RecoveryJ7 } from "../emails/recovery-j7";
import { EscalationAlert } from "../emails/escalation-alert";
import z from "zod";

const ESCALATION_THRESHOLD_CENTS = 5000; // 50€ / $50

export const sendRecoveryEmailTask = schemaTask({
  id: "send-recovery-email",
  maxDuration: 60,
  schema: z.object({
    emailSequenceId: z.string(),
  }),
  run: async (payload) => {
    const { emailSequenceId } = payload;

    const seq = await db.query.emailSequences.findFirst({
      where: eq(emailSequences.id, emailSequenceId),
      with: { failedPayment: true },
    });

    if (!seq || !seq.failedPayment) {
      logger.warn("Email sequence or payment not found", { emailSequenceId });
      return { skipped: true, reason: "not_found" };
    }

    // Règle : si payment_intent.succeeded est arrivé → statut recovered → on n'envoie pas
    if (
      seq.failedPayment.status === "recovered" ||
      seq.failedPayment.status === "lost"
    ) {
      await db
        .update(emailSequences)
        .set({ status: "cancelled" })
        .where(eq(emailSequences.id, emailSequenceId));
      return { skipped: true, reason: "recovered" };
    }

    if (seq.status !== "pending") {
      return { skipped: true, reason: "already_sent", status: seq.status };
    }

    const payment = seq.failedPayment;
    const appUrl = env.APP_URL;
    const token = createCardUpdateToken(payment.id);
    const updateCardUrl = `${appUrl}/api/update-card/${token}`;

    const resend = new Resend(env.RESEND_API_KEY);
    const from =
      (process.env.RESEND_FROM as string) ?? "Dunlo <no-reply@biume.com>";

    let subject: string;
    let react: React.ReactElement;

    switch (seq.step) {
      case 1: {
        const msg = getJ0Message(payment.failureReason);
        subject = msg.subject;
        react = (
          <RecoveryJ0
            customerName={payment.customerName}
            headline={msg.headline}
            updateCardUrl={updateCardUrl}
          />
        );
        break;
      }
      case 2: {
        subject = "Rappel : mettez à jour votre moyen de paiement";
        react = (
          <RecoveryJ3
            customerName={payment.customerName}
            updateCardUrl={updateCardUrl}
          />
        );
        break;
      }
      case 3: {
        const formattedAmount = new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: payment.currency.toUpperCase(),
          minimumFractionDigits: 0,
        }).format(payment.amount / 100);
        subject = "Dernier message avant la suspension de votre accès";
        react = (
          <RecoveryJ7
            customerName={payment.customerName}
            productName={payment.productName ?? "votre abonnement"}
            formattedAmount={formattedAmount}
            updateCardUrl={updateCardUrl}
          />
        );
        break;
      }
      default:
        logger.warn("Unknown step", { step: seq.step });
        return { skipped: true, reason: "unknown_step" };
    }

    const { data, error } = await resend.emails.send({
      from,
      to: [payment.customerEmail],
      subject,
      react,
    });

    if (error) {
      logger.error("Failed to send recovery email", { error, emailSequenceId });
      throw new Error(`Resend error: ${error.message}`);
    }

    await db
      .update(emailSequences)
      .set({
        status: "sent",
        sendAt: new Date(),
      })
      .where(eq(emailSequences.id, emailSequenceId));

    logger.info("Recovery email sent", {
      emailSequenceId,
      step: seq.step,
      resendId: data?.id,
    });

    // J+7 : après envoi, chemin A (escalade) ou B (lost)
    if (seq.step === 3) {
      if (payment.amount >= ESCALATION_THRESHOLD_CENTS) {
        const existingEscalation = await db.query.escalations.findFirst({
          where: and(
            eq(escalations.failedPaymentId, payment.id),
            isNull(escalations.resolvedAt),
          ),
        });
        if (!existingEscalation) {
          await db.insert(escalations).values({
            failedPaymentId: payment.id,
            userId: payment.userId!,
            reason: `Montant > seuil (${payment.amount} cents). Failure: ${payment.failureReason}. 3 emails envoyés.`,
          });
          await db
            .update(failedPayments)
            .set({ status: "escalated" })
            .where(eq(failedPayments.id, payment.id));
          logger.info("Escalation created", { paymentId: payment.id });

          // Envoyer email d'alerte au founder
          const user = await db.query.users.findFirst({
            where: eq(users.id, payment.userId!),
          });
          if (user) {
            const founderEmail = user.notificationEmail ?? user.email;
            const formattedAmount = new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: payment.currency.toUpperCase(),
              minimumFractionDigits: 0,
            }).format(payment.amount / 100);
            const paymentUrl = `${env.APP_URL}/payment/${payment.id}`;
            await resend.emails.send({
              from,
              to: [founderEmail],
              subject: `Escalade — ${payment.customerName} · ${formattedAmount} non récupéré`,
              react: (
                <EscalationAlert
                  customerName={payment.customerName}
                  customerEmail={payment.customerEmail}
                  formattedAmount={formattedAmount}
                  failureReason={payment.failureReason}
                  paymentUrl={paymentUrl}
                />
              ),
            });
            logger.info("Escalation alert sent to founder", { founderEmail, paymentId: payment.id });
          }
        }
      } else {
        await db
          .update(failedPayments)
          .set({ status: "lost" })
          .where(eq(failedPayments.id, payment.id));
        logger.info("Payment marked as lost", { paymentId: payment.id });
      }
    }

    return { sent: true, step: seq.step, resendId: data?.id };
  },
});
