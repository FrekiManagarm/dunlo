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

    const platformStripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-02-25.clover",
    });

    const webhookEndpoint = await platformStripe.webhookEndpoints.create(
      {
        url: webhookUrl,
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
  options?: { userSecretKey?: string; stripeAccountId?: string },
): Promise<boolean> {
  try {
    const stripe = options?.userSecretKey
      ? new Stripe(options.userSecretKey, {
          apiVersion: "2026-02-25.clover",
        })
      : new Stripe(env.STRIPE_SECRET_KEY, {
          apiVersion: "2026-02-25.clover",
        });

    const requestOptions =
      options?.stripeAccountId ?
        { stripeAccount: options.stripeAccountId }
      : undefined;
    await stripe.webhookEndpoints.del(
      webhookEndpointId,
      requestOptions as Stripe.RequestOptions,
    );

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
