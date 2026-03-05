import { db } from "@dunlo/db";
import { accounts } from "@dunlo/db/schema/account";
import { sessions } from "@dunlo/db/schema/session";
import { users } from "@dunlo/db/schema/user";
import { verifications } from "@dunlo/db/schema/verification";
import { env } from "@dunlo/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users: users,
      sessions: sessions,
      accounts: accounts,
      verifications: verifications,
    },
    usePlural: true,
  }),
  trustedOrigins: [env.CORS_ORIGIN],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
