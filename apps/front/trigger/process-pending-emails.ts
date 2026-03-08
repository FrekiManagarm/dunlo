import { logger, schedules } from "@trigger.dev/sdk/v3";
import { lte, eq, and } from "drizzle-orm";
import { db } from "@dunlo/db";
import { emailSequences } from "@dunlo/db/schema";
import { sendRecoveryEmailTask } from "./send-recovery-email";

/**
 * Tâche planifiée : toutes les 15 min, trouve les emails pending dont
 * scheduledAt <= now et déclenche l'envoi.
 * Fenêtre 9h-18h gérée au moment de la création du scheduledAt.
 */
export const processPendingEmailsTask = schedules.task({
  id: "process-pending-emails",
  cron: "*/15 * * * *", // Toutes les 15 min
  run: async (payload) => {
    const now = new Date();

    const due = await db.query.emailSequences.findMany({
      where: and(
        eq(emailSequences.status, "pending"),
        lte(emailSequences.scheduledAt, now),
      ),
      columns: { id: true },
    });

    if (due.length === 0) {
      logger.info("No pending emails to send");
      return { processed: 0 };
    }

    const triggers = due.map((seq) =>
      sendRecoveryEmailTask.trigger(
        { emailSequenceId: seq.id },
        { idempotencyKey: `send-${seq.id}` },
      ),
    );

    await Promise.all(triggers);

    logger.info("Triggered send for pending emails", {
      count: due.length,
      ids: due.map((d) => d.id),
    });

    return { processed: due.length };
  },
});
