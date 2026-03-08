import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@dunlo/db";
import { failedPayments, stripeConnection } from "@dunlo/db/schema";
import { getStripeClient, getConnectedStripeClient } from "@/lib/stripe/client";
import { decrypt } from "@/lib/stripe/encryption";
import { verifyCardUpdateToken } from "@/lib/recovery/token";
import { env } from "@dunlo/env/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const parsed = verifyCardUpdateToken(token);

  if (!parsed) {
    return new Response("Lien invalide ou expiré", { status: 400 });
  }

  const payment = await db.query.failedPayments.findFirst({
    where: eq(failedPayments.id, parsed.failedPaymentId),
    with: { user: true },
  });

  if (!payment || !payment.userId) {
    return new Response("Paiement introuvable", { status: 404 });
  }

  const connection = await db.query.stripeConnection.findFirst({
    where: eq(stripeConnection.userId, payment.userId),
  });

  if (!connection?.accessToken || !payment.stripeCustomerId) {
    return new Response("Configuration introuvable", { status: 404 });
  }

  const stripe =
    connection.accessToken != null
      ? getConnectedStripeClient(decrypt(connection.accessToken))
      : getStripeClient();

  const session = await stripe.billingPortal.sessions.create({
    customer: payment.stripeCustomerId,
    return_url: `${env.APP_URL}/dashboard`,
  });

  return Response.redirect(session.url);
}
