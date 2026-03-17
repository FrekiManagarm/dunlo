import { NextRequest } from "next/server";
import type Stripe from "stripe";
import { eq } from "drizzle-orm";
import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";
import { constructWebhookEvent } from "@/lib/stripe/client";
import { decrypt } from "@/lib/stripe/encryption";
import {
  handlePaymentActionRequired,
  handlePaymentFailed,
  handlePaymentSucceeded,
  handleSubscriptionDeleted,
} from "@/lib/stripe/handle-payment-events";
import { createError, useLogger, withEvlog } from "@/lib/evlog";

export const POST = withEvlog(async (request: NextRequest) => {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const logger = useLogger();

  if (!signature) {
    logger.set({ message: "Missing stripe-signature header", status: 400 });
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const connections = await db.query.stripeConnection.findMany({
    where: eq(stripeConnection.isActive, true),
  });

  let event: Stripe.Event | null = null;
  let matchedConnection: (typeof connections)[number] | null = null;

  for (const conn of connections) {
    if (!conn.webhookSecret) continue;
    try {
      const secret = decrypt(conn.webhookSecret);
      event = constructWebhookEvent(body, signature, secret);
      matchedConnection = conn;
      break;
    } catch (err) {
      // Signature didn't match, try next
      const error = err instanceof Error ? err : null;
      logger.error({
        name: error?.name || "",
        message: error?.message || "",
        cause: error?.cause,
        stack: error?.stack,
      });
      throw createError({
        message: error?.message || "",
      });
    }
  }

  if (!event || !matchedConnection) {
    logger.set({
      message: "❌ No matching webhook secret found",
      status: 400,
      service: "stripe-webhook",
    });
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  const userId = matchedConnection.userId!;

  try {
    switch (event.type) {
      case "payment_intent.payment_failed":
        await handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent,
          userId,
          { accessToken: matchedConnection.accessToken },
        );
        break;
      case "payment_intent.succeeded":
        await handlePaymentSucceeded(
          event.data.object as Stripe.PaymentIntent,
          userId,
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
          userId,
        );
        break;
      case "invoice.payment_action_required":
        await handlePaymentActionRequired(
          event.data.object as Stripe.Invoice,
          userId,
          matchedConnection,
        );
        break;
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    logger.set({
      message: `❌ Error processing webhook ${event.type}:`,
      status: 500,
      service: "stripe-webhook",
      error,
    });
    return new Response("Webhook handler error", { status: 500 });
  }
});
