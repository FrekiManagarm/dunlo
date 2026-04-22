import { redirect } from "next/navigation";
import { SettingsClient } from "./settings-client";
import { getStripeConnectionStatus, getUserSettings } from "@/actions/stripe";
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
    <div className="app-page">
      <div className="app-row mb-12" style={{ "--delay": "0ms" } as React.CSSProperties}>
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Configuration
        </p>
        <h1 className="font-display text-3xl tracking-tight text-foreground">Settings</h1>
      </div>
      <SettingsClient
        connection={connection}
        settings={settings}
        isDev={process.env.NODE_ENV === "development"}
      />
    </div>
  );
}
