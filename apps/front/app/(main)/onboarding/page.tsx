import { redirect } from "next/navigation";
import {
  getStripeConnectionStatus,
  getUserSettings,
} from "@/actions/stripe";
import { getSession } from "@/actions/auth";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const connection = await getStripeConnectionStatus();
  const settings = await getUserSettings();

  return (
    <OnboardingClient
      isStripeConnected={connection.isConnected}
      stripeAccountId={connection.stripeAccountId}
      initialSettings={{
        notificationEmail: settings.notificationEmail ?? session.user.email,
        escalationThreshold: settings.escalationThreshold,
        timezone: settings.timezone,
      }}
    />
  );
}
