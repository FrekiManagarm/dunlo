import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel } from "drizzle-orm";
import { sessions, type Sessions } from "./session";
import { accounts, type Accounts } from "./account";
import { stripeConnection, type StripeConnection } from "./stripe_connection";
import { failedPayments, type FailedPayment } from "./failed_payments";
import { escalations, type Escalation } from "./escalations";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  stripeConnections: many(stripeConnection),
  failedPayments: many(failedPayments),
  escalations: many(escalations),
}));

export type Users = InferSelectModel<typeof users> & {
  sessions: Sessions[];
  accounts: Accounts[];
  stripeConnections: StripeConnection[];
  failedPayments: FailedPayment[];
  escalations: Escalation[];
};