import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { users, type Users } from "./user";
import { relations, type InferSelectModel } from "drizzle-orm";
import { emailSequences, type EmailSequence } from "./email_sequences";
import { escalations, type Escalation } from "./escalations";

export const failedPaymentStatus = pgEnum("failed_payment_status", ["detected", "emailing", "escalated", "recovered", "lost"]);

export const failedPayments = pgTable("failed_payments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique().notNull(),
  customerEmail: text("customer_email").notNull(),
  customerName: text("customer_name").notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull(),
  failureReason: text("failure_reason").notNull(),
  status: failedPaymentStatus("status").default("detected").notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  recoveredAt: timestamp("recovered_at"),
});

export const failedPaymentsRelations = relations(failedPayments, ({ one, many }) => ({
  user: one(users, {
    fields: [failedPayments.userId],
    references: [users.id],
  }),
  emailSequences: many(emailSequences),
  escalations: many(escalations),
}));

export type FailedPayment = InferSelectModel<typeof failedPayments> & {
  user: Users;
  emailSequences: EmailSequence[];
  escalations: Escalation[];
};