"use client";

import Link from "next/link";
import { Check, Unplug, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  disconnectStripe,
  updateUserSettings,
} from "@/actions/stripe";

type Connection = {
  isConnected: boolean;
  stripeAccountId: string | null;
  connectedAt: string | null;
};

type Settings = {
  escalationThreshold: number;
  notificationEmail: string;
};

export function SettingsClient({
  connection,
  settings,
}: {
  connection: Connection;
  settings: Settings;
}) {
  const router = useRouter();
  const [escalationThreshold, setEscalationThreshold] = useState(
    String(settings.escalationThreshold),
  );
  const [notificationEmail, setNotificationEmail] = useState(
    settings.notificationEmail,
  );
  const [saving, setSaving] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateUserSettings({
        escalationThreshold: Number(escalationThreshold) || 200,
        notificationEmail,
      });
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await disconnectStripe();
      toast.success("Stripe disconnected");
      router.refresh();
    } catch {
      toast.error("Failed to disconnect Stripe");
    } finally {
      setDisconnecting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-foreground">Settings</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage your Stripe connection and recovery preferences.
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">
              Stripe connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {connection.isConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center border border-emerald-500/20 bg-emerald-500/10">
                    <Check className="size-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Connected
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {connection.stripeAccountId}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                >
                  {disconnecting ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Unplug className="size-3" />
                  )}
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  No Stripe account connected.
                </p>
                <Link href="/onboarding">
                  <Button size="sm">Connect Stripe</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">
              Escalation threshold
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Automatically escalate accounts with a monthly value above this
              amount. Lower-value accounts will still go through the email
              sequence.
            </p>
            <div className="flex items-center gap-2">
              <Label htmlFor="threshold" className="text-xs text-muted-foreground">
                Escalate accounts above
              </Label>
              <div className="relative w-32">
                <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-muted-foreground">
                  €
                </span>
                <Input
                  id="threshold"
                  type="number"
                  value={escalationThreshold}
                  onChange={(e) => setEscalationThreshold(e.target.value)}
                  className="pl-6"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">
              Notification email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Where we&apos;ll send escalation alerts and recovery reports.
            </p>
            <Input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="max-w-sm"
            />
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-sm text-foreground">
              Email sequences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Recovery emails are sent on a fixed schedule. Custom sequences
              coming soon.
            </p>
            <div className="flex gap-3">
              {[
                { day: "J+0", label: "First notice" },
                { day: "J+3", label: "Reminder" },
                { day: "J+7", label: "Final notice" },
              ].map(({ day, label }) => (
                <div
                  key={day}
                  className="flex items-center gap-2 border border-border bg-muted/30 px-3 py-2"
                >
                  <span className="font-mono text-xs font-medium text-primary">
                    {day}
                  </span>
                  <Separator orientation="vertical" className="h-3" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="gap-2"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Save settings
          </Button>
        </div>
      </div>
    </div>
  );
}
