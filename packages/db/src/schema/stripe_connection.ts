import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users, type Users } from "./user";
import { relations, type InferSelectModel } from "drizzle-orm";

export const stripeConnection = pgTable(
  "stripe_connection",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    stripeAccountId: text("stripe_account_id"),
    accessToken: text("access_token"),
    webhookEndpointId: text("webhook_endpoint_id"),
    webhookSecret: text("webhook_secret"),
    connectedAt: timestamp("connected_at").defaultNow().notNull(),
    lastSyncAt: timestamp("last_sync_at"),
    isActive: boolean("is_active").default(true).notNull(),
  },
);

export const stripeConnectionRelations = relations(stripeConnection, ({ one }) => ({
  user: one(users, {
    fields: [stripeConnection.userId],
    references: [users.id],
  }),
}));

export type StripeConnection = InferSelectModel<typeof stripeConnection> & {
  user: Users;
};