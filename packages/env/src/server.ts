import "dotenv/config";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    APP_URL: z.url(),
    CORS_ORIGIN: z.url(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_CLIENT_ID: z.string().min(1),
    ENCRYPTION_KEY: z.string().length(64),
    RESEND_API_KEY: z.string().min(1),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  experimental__runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
