import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const betaSignup = pgTable("beta_signup", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BetaSignup = typeof betaSignup.$inferSelect;
export type NewBetaSignup = typeof betaSignup.$inferInsert;