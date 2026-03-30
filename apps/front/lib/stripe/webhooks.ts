import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { encrypt } from "./encryption";
import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { useLogger } from "@/lib/evlog";

/**
 * Create webhooks for a Direct (API key) connection.
 * Uses the user's Stripe client directly since they provided their secret key.
 */
export async function setupWebhooksForDirectAccount(
  userStripe: Stripe,
  connectionId: string,
): Promise<{ webhookEndpointId: string; webhookSecret: string } | null> {
  const log = useLogger();
  try {
    const baseUrl = env.APP_URL;
    const webhookUrl = `${baseUrl}/api/webhooks/stripe`;

    if (
      baseUrl.includes("localhost") ||
      baseUrl.includes("127.0.0.1") ||
      baseUrl.startsWith("http://")
    ) {
      log.set({ stripe: { webhook: { skipped: true, reason: "local_dev", connectionId } } });
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

    log.set({ stripe: { webhook: { id: webhookEndpoint.id, connectionId, created: true } } });
    return {
      webhookEndpointId: webhookEndpoint.id,
      webhookSecret: webhookEndpoint.secret!,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.set({ stripe: { webhook: { connectionId, error: err.message } } });
    return null;
  }
}

export async function setupWebhooks(
  stripeAccountId: string,
  accessToken: string,
): Promise<{ webhookEndpointId: string; webhookSecret: string } | null> {
  const log = useLogger();
  try {
    const baseUrl = env.APP_URL || "https://dunlo.io";
    const webhookUrl = `${baseUrl}/api/webhooks/stripe/${stripeAccountId}`;

    if (
      baseUrl.includes("localhost") ||
      baseUrl.includes("127.0.0.1") ||
      baseUrl.startsWith("http://")
    ) {
      log.set({
        stripe: {
          webhook: {
            skipped: true,
            reason: "local_dev",
            hint: `stripe listen --forward-to ${baseUrl}/api/webhooks/stripe`,
            accountId: stripeAccountId,
          },
        },
      });

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

    log.set({ stripe: { webhook: { accountId: stripeAccountId, configuring: true } } });

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

    log.set({ stripe: { webhook: { id: webhookEndpoint.id, accountId: stripeAccountId, created: true } } });

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
    const err = error instanceof Error ? error : new Error(String(error));
    log.set({ stripe: { webhook: { accountId: stripeAccountId, error: err.message } } });
    return null;
  }
}

export async function deleteWebhooks(
  webhookEndpointId: string,
  accessToken: string,
  stripeAccountId: string,
): Promise<boolean> {
  const log = useLogger();
  try {
    const stripe = new Stripe(accessToken, {
      apiVersion: "2026-02-25.clover",
    });

    await stripe.webhookEndpoints.del(webhookEndpointId, {
      stripeAccountId: stripeAccountId,
    });

    log.set({ stripe: { webhook: { id: webhookEndpointId, accountId: stripeAccountId, deleted: true } } });
    return true;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.set({ stripe: { webhook: { id: webhookEndpointId, accountId: stripeAccountId, deleteError: err.message } } });
    return false;
  }
}

export async function updateWebhookEvents(
  accessToken: string,
  webhookEndpointId: string,
  stripeAccountId: string,
  events: Stripe.WebhookEndpointUpdateParams.EnabledEvent[],
): Promise<boolean> {
  const log = useLogger();
  try {
    // Les webhooks Connect sont gérés au niveau plateforme (pas de stripeAccount)
    const stripe = new Stripe(accessToken, {
      apiVersion: "2026-02-25.clover",
    });

    await stripe.webhookEndpoints.update(
      webhookEndpointId,
      {
        enabled_events: events,
      },
      {
        stripeAccount: stripeAccountId,
      },
    );

    log.set({ stripe: { webhook: { id: webhookEndpointId, accountId: stripeAccountId, updated: true } } });
    return true;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    log.set({ stripe: { webhook: { id: webhookEndpointId, accountId: stripeAccountId, updateError: err.message } } });
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
  const log = useLogger();
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
    const err = error instanceof Error ? error : new Error(String(error));
    log.set({ stripe: { webhook: { accountId: stripeAccountId, listError: err.message } } });
    return [];
  }
}
