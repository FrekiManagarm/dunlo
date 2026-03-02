import Stripe from "stripe";

export * from "./client";
export * from "./encryption";
export * from "./customer-manager";

export const stripePlatformClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});
