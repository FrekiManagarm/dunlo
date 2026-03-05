import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";
import {
  getStripeConnectionStatus,
  getUserSettings,
} from "@/actions/stripe";
import { getSession } from "@/actions/auth";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const [connection, settings] = await Promise.all([
    getStripeConnectionStatus(),
    getUserSettings(),
  ]);

  return (
    <SettingsClient
      connection={connection}
      settings={settings}
    />
  );
}
