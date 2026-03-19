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

export function getConnectedStripeClient(
  encryptedAccessToken: string,
  options?: { alreadyDecrypted?: boolean },
): Stripe {
  let secretKey: string;
  if (options?.alreadyDecrypted) {
    secretKey = encryptedAccessToken;
  } else {
    try {
      secretKey = decrypt(encryptedAccessToken);
    } catch (err) {
      // Tokens stored before encryption (e.g. fallback route) may be plain
      if (
        err instanceof Error &&
        err.message.includes("Invalid encrypted text format")
      ) {
        secretKey = encryptedAccessToken;
      } else {
        throw err;
      }
    }
  }
  return new Stripe(secretKey, {
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
