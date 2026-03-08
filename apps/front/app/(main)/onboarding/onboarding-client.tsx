"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Shield, Zap, Clock, Key, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  getStripeConnectUrl,
  connectStripeWithApiKey,
  updateUserSettings,
  runOnboardingVerification,
} from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OnboardingClientProps = {
  isStripeConnected: boolean;
  stripeAccountId: string | null;
  initialSettings: {
    notificationEmail: string;
    escalationThreshold: number;
    timezone: string;
  };
};

export function OnboardingClient({
  isStripeConnected,
  stripeAccountId,
  initialSettings,
}: OnboardingClientProps) {
  const router = useRouter();
  const [step, setStep] = useState<"stripe" | "config">(
    isStripeConnected ? "config" : "stripe",
  );
  const [oauthLoading, setOauthLoading] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);

  const [notificationEmail, setNotificationEmail] = useState(
    initialSettings.notificationEmail,
  );
  const [escalationThreshold, setEscalationThreshold] = useState(
    String(initialSettings.escalationThreshold),
  );
  const [timezone, setTimezone] = useState(initialSettings.timezone);

  async function handleOAuthConnect() {
    setOauthLoading(true);
    try {
      const { url } = await getStripeConnectUrl();
      window.location.href = url;
    } catch {
      setOauthLoading(false);
      toast.error("Could not connect to Stripe");
    }
  }

  async function handleApiKeyConnect() {
    setApiKeyError(null);
    if (!apiKey.trim()) {
      setApiKeyError("Enter your Stripe Secret Key");
      return;
    }
    setApiKeyLoading(true);
    try {
      await connectStripeWithApiKey(apiKey.trim());
      toast.success("Stripe connected");
      router.refresh();
      setStep("config");
    } catch (err) {
      setApiKeyError(err instanceof Error ? err.message : "Invalid key");
      toast.error("Invalid key");
    } finally {
      setApiKeyLoading(false);
    }
  }

  async function handleConfigSubmit() {
    setConfigLoading(true);
    try {
      await updateUserSettings({
        notificationEmail,
        escalationThreshold: Number(escalationThreshold) || 200,
        timezone,
      });

      const verification = await runOnboardingVerification(timezone);

      if (verification.failedPaymentsImported > 0) {
        toast.success(
          `Found ${verification.failedPaymentsImported} failed payment(s). Sequences started.`,
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setConfigLoading(false);
    }
  }

  // Step 1: Stripe connection
  if (step === "stripe") {
    return (
      <div className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
        <div className="mx-auto w-full max-w-lg text-center">
          <div
            className="mx-auto mb-10 flex size-16 items-center justify-center border border-primary/20 bg-primary/5"
            style={{ animation: "onb-glow 4s ease-in-out infinite" }}
          >
            <span className="font-display text-3xl text-primary">d</span>
          </div>

          <h1 className="font-display text-3xl text-foreground">
            Connect your Stripe account
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Dunlo needs read access to your Stripe data to detect failed
            payments and recover them automatically.
          </p>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={handleOAuthConnect}
              disabled={oauthLoading}
              className="group inline-flex w-full max-w-sm items-center justify-center gap-3 bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,232,123,0.2)] disabled:opacity-50"
            >
              {oauthLoading ? (
                "Redirecting…"
              ) : (
                <>
                  Connect with Stripe
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground">
              Recommended. OAuth is secure and takes 2 minutes.
            </p>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Key className="size-3.5" />
                {showApiKey ? "Hide" : "Use API Key instead"}
              </button>
            </div>

            {showApiKey && (
              <div className="mx-auto mt-4 max-w-sm space-y-3 rounded-lg border border-border bg-muted/20 p-4 text-left">
                <Label className="text-xs text-muted-foreground">
                  Stripe Secret Key (sk_live_xxx or sk_test_xxx)
                </Label>
                <Input
                  type="password"
                  placeholder="sk_live_xxxxx"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setApiKeyError(null);
                  }}
                  className="font-mono text-sm"
                />
                {apiKeyError && (
                  <p className="text-xs text-red-400">{apiKeyError}</p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApiKeyConnect}
                  disabled={apiKeyLoading}
                  className="w-full"
                >
                  {apiKeyLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Verify and connect"
                  )}
                </Button>
              </div>
            )}
          </div>

          <div className="mx-auto mt-12 grid max-w-md grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Secure", desc: "OAuth 2.0, read-only access" },
              { icon: Zap, title: "Instant", desc: "Recovery starts immediately" },
              { icon: Clock, title: "2 min", desc: "Quick and painless setup" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="mx-auto mb-2 flex size-8 items-center justify-center border border-border">
                  <Icon className="size-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs font-medium text-foreground">{title}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Config
  return (
    <div className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <div className="mx-auto w-full max-w-lg">
        <div
          className="mx-auto mb-8 flex size-14 items-center justify-center border border-primary/20 bg-primary/5"
          style={{ animation: "onb-glow 4s ease-in-out infinite" }}
        >
          <span className="font-display text-2xl text-primary">d</span>
        </div>

        <h1 className="font-display text-2xl text-foreground">
          Basic configuration
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Three quick settings, then you&apos;re done.
        </p>

        {stripeAccountId && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <Check className="size-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">
              Stripe connected — {stripeAccountId}
            </span>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Notification email
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Where Dunlo sends escalation alerts
            </p>
            <Input
              id="email"
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              className="mt-2"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <Label htmlFor="threshold" className="text-sm font-medium">
              Escalation threshold
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Escalate accounts above this monthly value (€/mo)
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">€</span>
              <Input
                id="threshold"
                type="number"
                min={0}
                value={escalationThreshold}
                onChange={(e) => setEscalationThreshold(e.target.value)}
                className="w-32"
              />
              <span className="text-xs text-muted-foreground">/mo</span>
            </div>
          </div>

          <div>
            <Label htmlFor="timezone" className="text-sm font-medium">
              Timezone
            </Label>
            <p className="mt-0.5 text-xs text-muted-foreground">
              For sending emails between 9h–18h your time
            </p>
            <Input
              id="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="mt-2"
              placeholder="Europe/Paris"
            />
          </div>
        </div>

        <Button
          onClick={handleConfigSubmit}
          disabled={configLoading}
          className="group mt-10 w-full bg-primary py-6 text-sm font-semibold text-primary-foreground hover:shadow-[0_0_40px_rgba(0,232,123,0.2)] disabled:opacity-50"
        >
          {configLoading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <>
              Start monitoring
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
