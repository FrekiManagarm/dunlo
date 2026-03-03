import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { failedPayments, type FailedPayment } from "./failed_payments";
import { users, type Users } from "./user";
import { relations, type InferSelectModel } from "drizzle-orm";

export const escalations = pgTable("escalations", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  failedPaymentId: text("failed_payment_id").references(() => failedPayments.id, { onDelete: "cascade" }),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  triggeredAt: timestamp("triggered_at").defaultNow().notNull(),
  reason: text("reason").notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const escalationsRelations = relations(escalations, ({ one }) => ({
  failedPayment: one(failedPayments, {
    fields: [escalations.failedPaymentId],
    references: [failedPayments.id],
  }),
  user: one(users, {
    fields: [escalations.userId],
    references: [users.id],
  }),
}));

export type Escalation = InferSelectModel<typeof escalations> & {
  failedPayment: FailedPayment;
  user: Users;
};