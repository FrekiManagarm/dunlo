import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { failedPayments, type FailedPayment } from "./failed_payments";
import { pgEnum } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";

export const emailSequenceStatus = pgEnum("email_sequence_status", ["pending", "sent", "opened", "clicked"]);

export const emailSequences = pgTable("email_sequences", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  failedPaymentId: text("failed_payment_id").references(() => failedPayments.id, { onDelete: "cascade" }),
  step: integer("step").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  sendAt: timestamp("send_at").notNull(),
  openedAt: timestamp("opened_at"),
  status: emailSequenceStatus("status").default("pending").notNull(),
});

export const emailSequencesRelations = relations(emailSequences, ({ one }) => ({
  failedPayment: one(failedPayments, {
    fields: [emailSequences.failedPaymentId],
    references: [failedPayments.id],
  }),
}));

export type EmailSequence = InferSelectModel<typeof emailSequences> & {
  failedPayment: FailedPayment;
};