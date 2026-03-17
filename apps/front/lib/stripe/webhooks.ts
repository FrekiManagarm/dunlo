import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { encrypt } from "./encryption";
import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";

/**
 * Create webhooks for a Direct (API key) connection.
 * Uses the user's Stripe client directly since they provided their secret key.
 */
export async function setupWebhooksForDirectAccount(
  userStripe: Stripe,
  connectionId: string,
): Promise<{ webhookEndpointId: string; webhookSecret: string } | null> {
  try {
    const baseUrl = env.APP_URL;
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`;

    if (
      baseUrl.includes("localhost") ||
      baseUrl.includes("127.0.0.1") ||
      baseUrl.startsWith("http://")
    ) {
      console.warn(
        `⚠️ Skipping webhook creation for local development (${baseUrl})`,
      );
      await db
        .update(stripeConnection)
        .set({
          webhookSecret: encrypt("whsec_local_dev_secret"),
          lastSyncAt: new Date(),
        })
        .where(eq(stripeConnection.id, connectionId));

      return {
        webhookEndpointId: "local_dev_webhook",
        webhookSecret: "whsec_local_dev_secret",
      };
    }

    const webhookEndpoint = await userStripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        "payment_intent.payment_failed",
        "payment_intent.succeeded",
        "customer.subscription.deleted",
        "invoice.payment_action_required",
      ],
      description: "Dunlo Payment Recovery (API Key)",
    });

    await db
      .update(stripeConnection)
      .set({
        webhookEndpointId: webhookEndpoint.id,
        webhookSecret: encrypt(webhookEndpoint.secret!),
        lastSyncAt: new Date(),
      })
      .where(eq(stripeConnection.id, connectionId));

    return {
      webhookEndpointId: webhookEndpoint.id,
      webhookSecret: webhookEndpoint.secret!,
    };
  } catch (error) {
    console.error(`❌ Error setting up webhooks for direct account:`, error);
    return null;
  }
}

export async function setupWebhooks(
  stripeAccountId: string,
  accessToken: string,
  userId: string,
): Promise<{ webhookEndpointId: string; webhookSecret: string } | null> {
  try {
    const baseUrl = env.APP_URL || "https://dunlo.io";
    const webhookUrl = `${baseUrl}/api/webhooks/stripe/${stripeAccountId}`;

    if (
      baseUrl.includes("localhost") ||
      baseUrl.includes("127.0.0.1") ||
      baseUrl.startsWith("http://")
    ) {
      console.warn(
        `⚠️ Skipping webhook creation for local development (${baseUrl})`,
      );
      console.warn(`💡 Use Stripe CLI to test webhooks locally:`);
      console.warn(
        `   stripe listen --forward-to ${baseUrl}/api/webhooks/stripe`,
      );

      await db
        .update(stripeConnection)
        .set({
          webhookSecret: encrypt("whsec_local_dev_secret"),
          lastSyncAt: new Date(),
        })
        .where(eq(stripeConnection.stripeAccountId, stripeAccountId));

      return {
        webhookEndpointId: "local_dev_webhook",
        webhookSecret: "whsec_local_dev_secret",
      };
    }

    console.log(`🔗 Setting up webhook for account ${stripeAccountId}`);

    const platformStripe = new Stripe(accessToken, {
      apiVersion: "2026-02-25.clover",
    });

    const webhookEndpoint = await platformStripe.webhookEndpoints.create(
      {
        url: webhookUrl,
        connect: true,
        enabled_events: [
          "payment_intent.payment_failed",
          "payment_intent.succeeded",
          "customer.subscription.deleted",
          "invoice.payment_action_required",
        ],
        description: `Dunlo Payment Recovery - ${stripeAccountId}`,
        metadata: {
          stripeAccountId,
        },
      },
      { stripeAccount: stripeAccountId },
    );

    console.log(
      `✅ Webhook created: ${webhookEndpoint.id} for account ${stripeAccountId}`,
    );

    await db
      .update(stripeConnection)
      .set({
        webhookEndpointId: webhookEndpoint.id,
        webhookSecret: encrypt(webhookEndpoint.secret!),
        lastSyncAt: new Date(),
      })
      .where(eq(stripeConnection.stripeAccountId, stripeAccountId));

    return {
      webhookEndpointId: webhookEndpoint.id,
      webhookSecret: webhookEndpoint.secret!,
    };
  } catch (error) {
    console.error(
      `❌ Error setting up webhooks for account ${stripeAccountId}:`,
      error,
    );
    return null;
  }
}

export async function deleteWebhooks(
  webhookEndpointId: string,
  accessToken: string,
  stripeAccountId: string,
): Promise<boolean> {
  try {
    const stripe = new Stripe(accessToken, {
      apiVersion: "2026-02-25.clover",
    });

    await stripe.webhookEndpoints.del(webhookEndpointId, {
      stripeAccountId: stripeAccountId,
    });

    console.log(`✅ Deleted webhook endpoint ${webhookEndpointId}`);
    return true;
  } catch (error) {
    console.error(
      `❌ Error deleting webhook endpoint ${webhookEndpointId}:`,
      error,
    );
    return false;
  }
}

export async function updateWebhookEvents(
  accessToken: string,
  webhookEndpointId: string,
  stripeAccountId: string,
  events: string[],
): Promise<boolean> {
  try {
    // Les webhooks Connect sont gérés au niveau plateforme (pas de stripeAccount)
    const stripe = new Stripe(accessToken, {
      apiVersion: "2026-02-25.clover",
    });

    await stripe.webhookEndpoints.update(
      webhookEndpointId,
      {
        enabled_events: events as any,
      },
      {
        stripeAccount: stripeAccountId,
      },
    );

    console.log(
      `✅ Updated Connect webhook endpoint ${webhookEndpointId} events`,
    );
    return true;
  } catch (error) {
    console.error(
      `❌ Error updating webhook endpoint ${webhookEndpointId}:`,
      error,
    );
    return false;
  }
}

/**
 * List all Connect webhook endpoints at platform level
 */
export async function listWebhooks(
  accessToken: string,
  stripeAccountId: string,
): Promise<Stripe.WebhookEndpoint[]> {
  try {
    // Les webhooks Connect sont gérés au niveau plateforme (pas de stripeAccount)
    const stripe = new Stripe(accessToken, {
      apiVersion: "2026-02-25.clover",
    });

    // Lister tous les webhooks Connect (filtrer côté client si nécessaire)
    const endpoints = await stripe.webhookEndpoints.list(
      { limit: 100 },
      {
        stripeAccount: stripeAccountId,
      },
    );
    return endpoints.data.filter((endpoint) =>
      endpoint.url?.includes(stripeAccountId),
    );
  } catch (error) {
    console.error("❌ Error listing webhook endpoints:", error);
    return [];
  }
}
