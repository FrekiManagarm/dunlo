import Stripe from "stripe";
import { decrypt } from "./encryption";
import { env } from "@dunlo/env/server";

let _platformClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!_platformClient) {
    _platformClient = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _platformClient;
}

export function getConnectedStripeClient(encryptedAccessToken: string): Stripe {
  return new Stripe(decrypt(encryptedAccessToken), {
    apiVersion: "2026-02-25.clover",
    typescript: true,
  });
}

export function constructWebhookEvent(
  payload: string,
  signature: string,
  secret: string,
): Stripe.Event {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, secret);
}
