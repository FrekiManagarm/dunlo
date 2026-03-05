/**
 * Customer Manager - Utilities for managing Stripe customers.
 */

import Stripe from "stripe";

export async function getOrCreateCustomer(
  stripeClient: Stripe,
  email: string,
  metadata?: Record<string, string>,
): Promise<string> {
  const existingCustomers = await stripeClient.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0].id;
  }

  const customer = await stripeClient.customers.create({
    email,
    metadata: {
      created_by: "dunlo",
      ...metadata,
    },
  });

  return customer.id;
}

export async function ensurePaymentIntentHasCustomer(
  stripeClient: Stripe,
  paymentIntent: Stripe.PaymentIntent,
): Promise<string | null> {
  if (paymentIntent.customer) {
    return paymentIntent.customer as string;
  }

  const latestCharge = paymentIntent.latest_charge;
  let charge: Stripe.Charge | null = null;

  if (typeof latestCharge === "string") {
    charge = await stripeClient.charges.retrieve(latestCharge);
  } else if (latestCharge) {
    charge = latestCharge;
  }

  const email =
    charge?.billing_details?.email || paymentIntent.receipt_email || null;

  if (!email) {
    return null;
  }

  const customerId = await getOrCreateCustomer(stripeClient, email);

  try {
    await stripeClient.paymentIntents.update(paymentIntent.id, {
      customer: customerId,
    });
  } catch {
    // Payment intent might be in a state where customer can't be updated
  }

  return customerId;
}
