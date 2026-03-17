import { useLogger, withEvlog } from "@/lib/evlog";
import { decrypt } from "@/lib/stripe/encryption";
import { db } from "@dunlo/db";
import { stripeConnection } from "@dunlo/db/schema";
import { env } from "@dunlo/env/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = withEvlog(
  async (
    req: NextRequest,
    { params }: { params: Promise<{ accountId: string }> },
  ) => {
    const { accountId } = await params;
    const logger = useLogger();
    const connection = await db.query.stripeConnection.findFirst({
      where: and(
        eq(stripeConnection.stripeAccountId, accountId),
        eq(stripeConnection.isActive, true),
      ),
      with: {
        user: true,
      },
    });

    if (!connection) {
      logger.error(`❌ No active connection for this account ${accountId}`);
      return NextResponse.json(
        {
          error: "Stripe account not connected",
        },
        { status: 404 },
      );
    }

    const userId = connection?.userId;

    const signature = req.headers.get("stripe-signature");

    if (!signature || !connection?.webhookSecret) {
      logger.error("❌ Missing signature or webhookSecret");
      return NextResponse.json(
        {
          error: "Invalid webhook signature",
        },
        { status: 401 },
      );
    }

    const rawBody = await req.arrayBuffer();
    const body = Buffer.from(rawBody).toString("utf-8");

    let webhookSecret = decrypt(connection?.webhookSecret as string);

    const stripeCliSecret = env.STRIPE_WEBHOOK_SECRET;

    if (
      stripeCliSecret ||
      (webhookSecret == "whsec_local_dev_secret" &&
        env.NODE_ENV == "development")
    ) {
      logger.info("Using stripe cli webhook secret from environment");
      webhookSecret = stripeCliSecret;
    }

    const stripe = new Stripe(connection.accessToken!, {
      apiVersion: "2026-02-25.clover",
    });

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const error = err instanceof Error ? err : null;
      logger.error({
        name: error?.name || "",
        message: error?.message || "",
        cause: error?.cause,
        stack: error?.stack,
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (event.account && event.account !== accountId) {
      logger.error({
        name: "account_mismatch_error",
        message: `❌ Account mismatch: expected ${accountId}, got ${event.account}`,
      });
      return NextResponse.json({ error: "Account mismatch" }, { status: 400 });
    }

    logger.set({ message: "event", data: event.data.object });

    logger.info(`✅ Webhook verified: ${event.type} (${event.id})`);

    //TODO: put autumn transactions limits
  },
);
