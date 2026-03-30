import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";
import { users } from "./user";

export const subscriptionEventType = pgEnum("subscription_event_type", [
  "downgrade",
  "upgrade",
  "cancelled",
  "reactivated",
]);

export const subscriptionEvents = pgTable("subscription_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  customerEmail: text("customer_email").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  type: subscriptionEventType("type").notNull(),
  previousAmount: integer("previous_amount").notNull(),
  newAmount: integer("new_amount").notNull(),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

export const subscriptionEventsRelations = relations(
  subscriptionEvents,
  ({ one }) => ({
    user: one(users, {
      fields: [subscriptionEvents.userId],
      references: [users.id],
    }),
  }),
);

export type SubscriptionEvent = InferSelectModel<typeof subscriptionEvents>;
