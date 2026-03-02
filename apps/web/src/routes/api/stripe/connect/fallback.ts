import { createFileRoute } from "@tanstack/react-router";
import Stripe from "stripe";

export const Route = createFileRoute("/api/stripe/connect/fallback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");
        const error_description = searchParams.get("error_description");

        const baseUrl = process.env.BETTER_AUTH_URL || "https://dunlo.io";

        if (error) {
          console.error(
            `❌ Stripe OAuth Error: ${error} - ${error_description}`,
          );
          return Response.redirect(
            `${baseUrl}/dashboard?error=stripe_connection_failed&reason=${error}`,
          );
        }

        if (!code || !state) {
          return Response.redirect(
            `${baseUrl}/dashboard?error=stripe_connection_failed&reason=missing_params`,
          );
        }

        try {
          const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2026-02-25.clover",
          });

          console.log(`🔄 Exchanging OAuth code for client ${state}`);

          const response = await stripe.oauth.token({
            grant_type: "authorization_code",
            code,
          });

          console.log(
            `✅ Received tokens for Stripe account: ${response.stripe_user_id}`,
          );
        } catch (error) {}
      },
    },
  },
});
