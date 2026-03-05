import { redirect } from "next/navigation";
import { getStripeConnectionStatus } from "@/actions/stripe";
import { getSession } from "@/actions/auth";
import { OnboardingClient } from "./onboarding-client";

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const status = await getStripeConnectionStatus();
  if (status.isConnected) {
    redirect("/dashboard");
  }

  return <OnboardingClient />;
}
