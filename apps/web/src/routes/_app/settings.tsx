import { createFileRoute } from "@tanstack/react-router";
import { Check, Unplug, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { session } = Route.useRouteContext();
  const [escalationThreshold, setEscalationThreshold] = useState("200");
  const [notificationEmail, setNotificationEmail] = useState(
    session?.user.email ?? "",
  );

  const isConnected = true;
  const stripeAccountId = "acct_1PxQ2r3sT4u5vW6x";

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
            {isConnected ? (
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
                      {stripeAccountId}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                  <Unplug className="size-3" />
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  No Stripe account connected.
                </p>
                <Button size="sm">Connect Stripe</Button>
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
              Where we'll send escalation alerts and recovery reports.
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
          <Button size="lg" className="gap-2">
            <Save className="size-3.5" />
            Save settings
          </Button>
        </div>
      </div>
    </div>
  );
}
