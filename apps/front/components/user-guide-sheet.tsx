"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  AlertTriangle,
  Settings,
  Mail,
  CreditCard,
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Zap,
    title: "How Dunlo works",
    description: "The full recovery loop in 5 steps.",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">
          Dunlo connects to your Stripe account and automatically recovers failed
          payments by sending a smart email sequence to your customers.
        </p>
        <ol className="space-y-2">
          {[
            "Stripe sends a webhook when a payment fails",
            "Dunlo detects it and creates a failed payment record",
            "An email sequence (J+0, J+3, J+7) is scheduled automatically",
            "If the customer pays → status moves to Recovered",
            "If not recovered and amount > threshold → Escalation alert sent to you",
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-xs text-muted-foreground">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    ),
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    description: "Track all your failed payments and their status.",
    content: (
      <div className="space-y-3 text-xs text-muted-foreground">
        <p>Each failed payment has a status that evolves throughout the recovery process:</p>
        <div className="space-y-2">
          {[
            { label: "Detected", color: "bg-blue-500/15 text-blue-400 ring-blue-500/20", desc: "Just detected, sequence being scheduled" },
            { label: "Emailing", color: "bg-amber-500/15 text-amber-400 ring-amber-500/20", desc: "Email sequence in progress" },
            { label: "Escalated", color: "bg-orange-500/15 text-orange-400 ring-orange-500/20", desc: "Sequence done, waiting for your action" },
            { label: "Recovered", color: "bg-green-500/15 text-green-400 ring-green-500/20", desc: "Payment successfully recovered" },
            { label: "Lost", color: "bg-red-500/15 text-red-400 ring-red-500/20", desc: "Sequence done, amount was below threshold" },
          ].map(({ label, color, desc }) => (
            <div key={label} className="flex items-center gap-3">
              <span className={cn("rounded px-2 py-0.5 text-[10px] font-medium ring-1", color)}>
                {label}
              </span>
              <span>{desc}</span>
            </div>
          ))}
        </div>
        <p className="pt-1 text-muted-foreground/70">
          Click any row to open the full payment timeline and email history.
        </p>
      </div>
    ),
  },
  {
    icon: Mail,
    title: "Email sequences",
    description: "Three automatic emails, sent at the right time.",
    content: (
      <div className="space-y-3 text-xs text-muted-foreground">
        <div className="rounded border border-border divide-y divide-border">
          {[
            { day: "J+0", label: "Immediate", desc: "Sent within 30 min of detection" },
            { day: "J+3", label: "Follow-up", desc: "First reminder, 3 days later" },
            { day: "J+7", label: "Final", desc: "Last email before escalation or lost" },
          ].map(({ day, label, desc }) => (
            <div key={day} className="flex items-center gap-4 px-3 py-2.5">
              <span className="font-mono text-[10px] font-semibold text-primary w-7 shrink-0">{day}</span>
              <ArrowRight className="size-3 shrink-0 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-[11px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>Sent only between <strong className="text-foreground">9am–6pm</strong> in the customer's timezone</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>All pending emails are cancelled if payment is recovered</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
            <span>Template adapts to the failure reason (card expired, insufficient funds…)</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: AlertTriangle,
    title: "Escalations",
    description: "High-value accounts that need your personal attention.",
    content: (
      <div className="space-y-3 text-xs text-muted-foreground">
        <p>
          After J+7, if the payment is still not recovered, Dunlo checks the
          amount against your <strong className="text-foreground">escalation threshold</strong>:
        </p>
        <div className="rounded border border-border divide-y divide-border">
          <div className="flex items-start gap-3 px-3 py-2.5">
            <span className="mt-0.5 text-orange-400 font-bold text-[11px] shrink-0">&gt; threshold</span>
            <span>Escalation created — you receive an alert to act (email + Slack optional). The account appears in your Escalations page.</span>
          </div>
          <div className="flex items-start gap-3 px-3 py-2.5">
            <span className="mt-0.5 text-muted-foreground/50 font-bold text-[11px] shrink-0">≤ threshold</span>
            <span>Status moves to Lost — no action required, not worth your time.</span>
          </div>
        </div>
        <p className="text-muted-foreground/70">
          You can adjust your threshold anytime in <strong className="text-foreground">Settings</strong>.
        </p>
      </div>
    ),
  },
  {
    icon: CreditCard,
    title: "Card update links",
    description: "How customers update their payment method.",
    content: (
      <div className="space-y-3 text-xs text-muted-foreground">
        <p>
          Each recovery email includes a secure link that takes the customer
          directly to Stripe's billing portal to update their card.
        </p>
        <div className="rounded border border-border divide-y divide-border">
          {[
            { label: "Unique per customer", desc: "Each link is tied to a specific customer and payment intent" },
            { label: "No login required", desc: "The customer lands directly on the card update form" },
            { label: "Secure", desc: "Tokens are signed and expire after use" },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-start gap-3 px-3 py-2.5">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Settings,
    title: "Settings",
    description: "Configure Dunlo to match your workflow.",
    content: (
      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="rounded border border-border divide-y divide-border">
          {[
            {
              label: "Escalation threshold",
              desc: "Minimum amount (€) to trigger an escalation. Below this goes to Lost.",
            },
            {
              label: "Notification email",
              desc: "Where escalation alerts land. Defaults to your account email.",
            },
            {
              label: "Timezone",
              desc: "Used for email scheduling and date formatting in the app.",
            },
            {
              label: "Morning brief",
              desc: "Daily digest of escalations and recovered payments at a time you choose.",
            },
            {
              label: "Slack webhook",
              desc: "Get escalation alerts directly in a Slack channel.",
            },
          ].map(({ label, desc }) => (
            <div key={label} className="px-3 py-2.5 space-y-0.5">
              <p className="font-medium text-foreground">{label}</p>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function UserGuideSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const Icon = step.icon;
  const isFirst = current === 0;
  const isLast = current === steps.length - 1;

  function handleClose() {
    onOpenChange(false);
    // reset step after close animation
    setTimeout(() => setCurrent(0), 200);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="sm:max-w-lg gap-0 p-0 overflow-hidden" showCloseButton>
        {/* Step indicators */}
        <div className="flex items-center gap-1 px-5 pt-5 pb-0">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={cn(
                  "flex h-1 flex-1 rounded-full transition-all",
                  i === current
                    ? "bg-primary"
                    : i < current
                    ? "bg-primary/30"
                    : "bg-muted",
                )}
              />
            );
          })}
        </div>

        {/* Header */}
        <DialogHeader className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-7 items-center justify-center rounded bg-primary/10">
              <Icon className="size-4 text-primary" />
            </div>
            <span className="text-[10px] text-muted-foreground/60 font-medium tabular-nums">
              {current + 1} / {steps.length}
            </span>
          </div>
          <DialogTitle className="text-base font-semibold">{step.title}</DialogTitle>
          <DialogDescription>{step.description}</DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="px-5 pb-5 min-h-[220px]">
          {step.content}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            disabled={isFirst}
            onClick={() => setCurrent((c) => c - 1)}
          >
            <ArrowLeft className="size-3.5" />
            Previous
          </Button>

          {isLast ? (
            <Button size="sm" onClick={handleClose}>
              Got it
            </Button>
          ) : (
            <Button size="sm" onClick={() => setCurrent((c) => c + 1)}>
              Next
              <ArrowRight className="size-3.5" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
