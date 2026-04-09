"use client";

import Link from "next/link";
import {
  Check,
  Unplug,
  Loader2,
  TestTube,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Mail,
  Globe,
  Clock,
  Slack,
  Save,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  disconnectStripe,
  updateUserSettings,
  simulatePaymentFailed,
  simulatePaymentRecovered,
  simulateEscalation,
} from "@/actions/stripe";

type Connection = {
  isConnected: boolean;
  stripeAccountId: string | null;
  connectedAt: string | null;
};

type Settings = {
  escalationThreshold: number;
  notificationEmail: string;
  timezone: string;
  morningBriefEnabled: boolean;
  morningBriefTime: string;
  slackWebhookUrl: string;
};

export function SettingsClient({
  connection,
  settings,
  isDev,
}: {
  connection: Connection;
  settings: Settings;
  isDev: boolean;
}) {
  const router = useRouter();
  const [escalationThreshold, setEscalationThreshold] = useState(
    String(settings.escalationThreshold),
  );
  const [notificationEmail, setNotificationEmail] = useState(
    settings.notificationEmail,
  );
  const [timezone, setTimezone] = useState(settings.timezone);
  const [morningBriefEnabled, setMorningBriefEnabled] = useState(
    settings.morningBriefEnabled,
  );
  const [morningBriefTime, setMorningBriefTime] = useState(
    settings.morningBriefTime,
  );
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(
    settings.slackWebhookUrl,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulatingRecovery, setSimulatingRecovery] = useState(false);
  const [simulatingEscalation, setSimulatingEscalation] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const initialSettings = useRef({
    escalationThreshold: String(settings.escalationThreshold),
    notificationEmail: settings.notificationEmail,
    timezone: settings.timezone,
    morningBriefEnabled: settings.morningBriefEnabled,
    morningBriefTime: settings.morningBriefTime,
    slackWebhookUrl: settings.slackWebhookUrl,
  });

  useEffect(() => {
    const orig = initialSettings.current;
    const dirty =
      escalationThreshold !== orig.escalationThreshold ||
      notificationEmail !== orig.notificationEmail ||
      timezone !== orig.timezone ||
      morningBriefEnabled !== orig.morningBriefEnabled ||
      morningBriefTime !== orig.morningBriefTime ||
      slackWebhookUrl !== orig.slackWebhookUrl;
    setIsDirty(dirty);
  }, [
    escalationThreshold,
    notificationEmail,
    timezone,
    morningBriefEnabled,
    morningBriefTime,
    slackWebhookUrl,
  ]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateUserSettings({
        escalationThreshold: Number(escalationThreshold) || 200,
        notificationEmail,
        timezone,
        morningBriefEnabled,
        morningBriefTime,
        slackWebhookUrl,
      });
      setSaved(true);
      setIsDirty(false);
      initialSettings.current = {
        escalationThreshold,
        notificationEmail,
        timezone,
        morningBriefEnabled,
        morningBriefTime,
        slackWebhookUrl,
      };
      setTimeout(() => setSaved(false), 2000);
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

  async function handleSimulatePaymentFailed() {
    setSimulating(true);
    try {
      const result = await simulatePaymentFailed();
      toast.success(result.message);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setSimulating(false);
    }
  }

  async function handleSimulatePaymentRecovered() {
    setSimulatingRecovery(true);
    try {
      const result = await simulatePaymentRecovered();
      toast.success(result.message);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setSimulatingRecovery(false);
    }
  }

  async function handleSimulateEscalation() {
    setSimulatingEscalation(true);
    try {
      const result = await simulateEscalation();
      toast.success(result.message);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Simulation failed");
    } finally {
      setSimulatingEscalation(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes settings-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes save-pop {
          0%   { opacity: 0; transform: translateY(12px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .settings-section {
          opacity: 0;
          animation: settings-in 0.55s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .save-bar {
          animation: save-pop 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
        }
      `}</style>

      <div className="pb-32">
        {/* Header */}
        <div
          className="settings-section mb-12"
          style={{ animationDelay: "0ms" }}
        >
          <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Configuration
          </p>
          <h1 className="font-display text-3xl text-foreground">Settings</h1>
        </div>

        <div className="max-w-3xl">
          {/* Section 01 — Stripe */}
          <Section
            index="01"
            icon={<Zap className="size-3.5" />}
            title="Stripe connection"
            description="Your connected payment processor. Dunlo listens to this account's webhooks."
            delay={80}
          >
            {connection.isConnected ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      Connected
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground">
                      {connection.stripeAccountId}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  disabled={disconnecting}
                  className="inline-flex items-center gap-1.5 rounded-none border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
                >
                  {disconnecting ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Unplug className="size-3" />
                  )}
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">
                    No account connected
                  </p>
                </div>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Connect Stripe
                </Link>
              </div>
            )}
          </Section>

          {/* Section 02 — Escalation */}
          <Section
            index="02"
            icon={<AlertTriangle className="size-3.5" />}
            title="Escalation threshold"
            description="Accounts with monthly value above this amount are escalated to you after the email sequence. Lower-value accounts are marked as lost."
            delay={140}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Escalate above
              </span>
              <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 font-mono text-xs text-muted-foreground">
                  €
                </span>
                <input
                  type="number"
                  value={escalationThreshold}
                  onChange={(e) => setEscalationThreshold(e.target.value)}
                  className="w-28 rounded-none border border-border/60 bg-white/5 py-1.5 pl-7 pr-3 font-mono text-sm text-foreground outline-none ring-0 transition-colors focus:border-primary focus:bg-primary/10"
                />
              </div>
              <span className="text-xs text-muted-foreground">per month</span>
            </div>
          </Section>

          {/* Section 03 — Notification email */}
          <Section
            index="03"
            icon={<Mail className="size-3.5" />}
            title="Notification email"
            description="Where escalation alerts and recovery reports are sent."
            delay={200}
          >
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full max-w-sm rounded-none border border-border/60 bg-white/5 py-1.5 px-3 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-primary focus:bg-primary/10"
            />
          </Section>

          {/* Section 04 — Timezone */}
          <Section
            index="04"
            icon={<Globe className="size-3.5" />}
            title="Timezone"
            description="Recovery emails are sent between 09:00 and 18:00 in this timezone."
            delay={260}
          >
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="Europe/Paris"
              className="w-full max-w-xs rounded-none border border-border/60 bg-white/5 py-1.5 px-3 font-mono text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-primary focus:bg-primary/10"
            />
          </Section>

          {/* Section 05 — Email sequences */}
          <Section
            index="05"
            icon={<Clock className="size-3.5" />}
            title="Email sequences"
            description="Recovery emails follow a fixed cadence. Custom sequences coming soon."
            delay={320}
          >
            <div className="space-y-4">
              <div className="flex gap-px">
                {[
                  { day: "D+0", label: "First notice", desc: "Within 30 min" },
                  { day: "D+3", label: "Reminder", desc: "Day 3" },
                  { day: "D+7", label: "Final notice", desc: "Day 7" },
                ].map(({ day, label, desc }, i) => (
                  <div
                    key={day}
                    className={cn(
                      "flex flex-1 flex-col gap-1 border border-border px-3 py-2.5",
                      i === 0 && "border-r-0",
                      i === 1 && "border-r-0",
                    )}
                  >
                    <span className="font-mono text-[10px] font-semibold text-primary">
                      {day}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {desc}
                    </span>
                  </div>
                ))}
              </div>

              {isDev && connection.isConnected && (
                <div className="space-y-1 pt-1">
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Simulate
                  </p>
                  <SimButton
                    icon={<TestTube className="size-3" />}
                    label="Payment failed"
                    sublabel="Creates a test payment + sends D+0 email to your notification address"
                    onClick={handleSimulatePaymentFailed}
                    loading={simulating}
                  />
                  <SimButton
                    icon={<CheckCircle2 className="size-3" />}
                    label="Payment recovered"
                    sublabel="Marks last failed payment as recovered, cancels pending emails"
                    onClick={handleSimulatePaymentRecovered}
                    loading={simulatingRecovery}
                    variant="success"
                  />
                  <SimButton
                    icon={<AlertTriangle className="size-3" />}
                    label="Escalation"
                    sublabel="Creates a high-value test escalation visible on the Escalations page"
                    onClick={handleSimulateEscalation}
                    loading={simulatingEscalation}
                    variant="warning"
                  />
                </div>
              )}
            </div>
          </Section>

          {/* Section 06 — Morning Brief */}
          <Section
            index="06"
            icon={<Slack className="size-3.5" />}
            title="Morning Brief"
            description="Receive a daily digest of at-risk accounts — by email and optionally on Slack."
            delay={380}
            last
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">
                    Enable Morning Brief
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Sent daily at your configured time
                  </p>
                </div>
                <Switch
                  checked={morningBriefEnabled}
                  onCheckedChange={setMorningBriefEnabled}
                />
              </div>

              {morningBriefEnabled && (
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <label className="w-28 shrink-0 text-[11px] text-muted-foreground">
                      Send time (UTC)
                    </label>
                    <input
                      type="time"
                      value={morningBriefTime}
                      onChange={(e) => setMorningBriefTime(e.target.value)}
                      className="rounded-none border border-border/60 bg-white/5 px-2 py-1 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-primary/10"
                    />
                  </div>
                  <div className="flex items-start gap-3">
                    <label className="mt-1.5 w-28 shrink-0 text-[11px] text-muted-foreground">
                      Slack webhook{" "}
                      <span className="text-muted-foreground/40">optional</span>
                    </label>
                    <div className="flex-1 space-y-1">
                      <input
                        type="url"
                        value={slackWebhookUrl}
                        onChange={(e) => setSlackWebhookUrl(e.target.value)}
                        placeholder="https://hooks.slack.com/services/..."
                        className="w-full rounded-none border border-border/60 bg-white/5 px-2 py-1 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 outline-none transition-colors focus:border-primary focus:bg-primary/10"
                      />
                      <a
                        href="https://api.slack.com/messaging/webhooks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-muted-foreground underline underline-offset-2 hover:text-foreground"
                      >
                        How to create a Slack webhook →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Floating save bar */}
      {isDirty && (
        <div className="save-bar pointer-events-none fixed right-6 bottom-6 z-50 flex items-center gap-3">
          <div className="pointer-events-auto flex items-center gap-3 border border-border bg-background/95 px-4 py-2.5 shadow-2xl backdrop-blur-xl">
            <span className="text-xs text-muted-foreground">
              Unsaved changes
            </span>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="size-3 animate-spin" />
              ) : saved ? (
                <Check className="size-3" />
              ) : (
                <Save className="size-3" />
              )}
              {saved ? "Saved" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Section({
  index,
  icon,
  title,
  description,
  children,
  delay,
  last = false,
}: {
  index: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  delay: number;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "settings-section grid grid-cols-[1fr_1.4fr] gap-x-8 py-8",
        !last && "border-b border-border",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground/50">
            {index}
          </span>
          <span className="text-muted-foreground/60">{icon}</span>
          <h2 className="font-display text-base text-foreground">{title}</h2>
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex flex-col justify-center">{children}</div>
    </div>
  );
}

function SimButton({
  icon,
  label,
  sublabel,
  onClick,
  loading,
  variant = "default",
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  onClick: () => void;
  loading: boolean;
  variant?: "default" | "success" | "warning";
}) {
  const colors = {
    default: "border-border hover:border-border/80 hover:bg-muted/30",
    success:
      "border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5",
    warning:
      "border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/5",
  };
  const iconColors = {
    default: "text-muted-foreground",
    success: "text-emerald-400",
    warning: "text-amber-400",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={cn(
        "group flex w-full items-start gap-3 border px-3 py-2.5 text-left transition-colors disabled:opacity-50",
        colors[variant],
      )}
    >
      <span
        className={cn(
          "mt-0.5 shrink-0 transition-colors",
          iconColors[variant],
          loading && "animate-pulse",
        )}
      >
        {loading ? <Loader2 className="size-3 animate-spin" /> : icon}
      </span>
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      </div>
    </button>
  );
}
