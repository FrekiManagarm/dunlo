"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, ExternalLink, ArrowRight } from "lucide-react";

import posthog from "posthog-js";

import { Button } from "@/components/ui/button";
import { DraftEditor } from "@/components/escalations/draft-editor";
import {
  generateDraft,
  type EscalationPriority,
  type FailureCategory,
} from "@/lib/escalations/draft-generator";
import { formatAmount } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Escalation = {
  id: string;
  paymentId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  emailsSent: number;
  daysSince: number;
  sequenceComplete: boolean;
  failureCode: string;
  tenureMonths: number;
  priority: EscalationPriority;
  annualValue: number;
};

const PRIORITY_CONFIG: Record<
  EscalationPriority,
  { label: string; accentClass: string; badgeClass: string; dotClass: string }
> = {
  critical: {
    label: "Critical",
    accentClass: "border-red-500/40",
    badgeClass: "text-red-400 bg-red-500/8 border-red-500/15",
    dotClass: "bg-red-400",
  },
  high: {
    label: "High",
    accentClass: "border-amber-500/40",
    badgeClass: "text-amber-400 bg-amber-500/8 border-amber-500/15",
    dotClass: "bg-amber-400",
  },
  normal: {
    label: "Normal",
    accentClass: "border-white/[0.05]",
    badgeClass: "text-muted-foreground bg-white/[0.04] border-white/[0.07]",
    dotClass: "bg-muted-foreground/50",
  },
};

const CATEGORY_LABELS: Record<FailureCategory, string> = {
  expired_card: "Expired card",
  insufficient_funds: "Insufficient funds",
  compromised_card: "Compromised card",
  generic: "Declined",
};

const CATEGORY_BADGE: Record<FailureCategory, string> = {
  expired_card: "text-amber-400 bg-amber-500/8 border-amber-500/15",
  insufficient_funds: "text-red-400 bg-red-500/8 border-red-500/15",
  compromised_card: "text-rose-400 bg-rose-500/8 border-rose-500/15",
  generic: "text-muted-foreground bg-white/[0.04] border-white/[0.07]",
};

export function EscalationsClient({
  escalations,
  onResolve,
}: {
  escalations: Escalation[];
  onResolve: (escalationId: string) => Promise<unknown>;
}) {
  const router = useRouter();

  async function handleResolve(escalationId: string) {
    await onResolve(escalationId);
    posthog.capture("escalation_resolved", { escalation_id: escalationId });
    router.refresh();
  }

  if (escalations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border-t border-white/[0.05] py-24">
        <CheckCircle2 className="mb-4 size-8 text-primary/40" strokeWidth={1.25} />
        <p className="text-[13px] font-medium text-foreground">All clear</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          No accounts need your attention right now.
        </p>
      </div>
    );
  }

  return (
    <div className="border-t border-white/[0.05]">
      {escalations.map((esc) => {
        const config = PRIORITY_CONFIG[esc.priority];

        const draft = generateDraft({
          customerName: esc.customerName,
          customerEmail: esc.customerEmail,
          amountCents: esc.amount,
          currency: esc.currency,
          failureCode: esc.failureCode,
          tenureMonths: esc.tenureMonths,
          emailsSent: esc.emailsSent,
          daysSince: esc.daysSince,
        });

        const categoryLabel = CATEGORY_LABELS[draft.category] ?? esc.failureCode;
        const categoryBadge = CATEGORY_BADGE[draft.category] ?? CATEGORY_BADGE.generic;

        return (
          <div
            key={esc.id}
            className={cn(
              "border-b border-white/[0.05] py-6 pl-4",
              "border-l-2",
              config.accentClass,
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* Priority badge + name + amounts */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest",
                      config.badgeClass,
                    )}
                  >
                    <span className={cn("size-1 rounded-full", config.dotClass)} />
                    {config.label}
                  </span>
                  <span className="text-[14px] font-medium text-foreground">
                    {esc.customerName}
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
                    {formatAmount(esc.amount, esc.currency)}/mo
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-muted-foreground/40">
                    {formatAmount(esc.annualValue, esc.currency)}/yr
                  </span>
                </div>

                {/* Context */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground/60">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="size-3" strokeWidth={1.5} />
                    {esc.emailsSent} emails sent · no response
                  </span>
                  <span>{esc.daysSince}d ago</span>
                  {esc.tenureMonths > 0 && <span>{esc.tenureMonths}mo customer</span>}
                </div>

                {/* Badges */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center border px-2 py-0.5 text-[10px] font-medium",
                      categoryBadge,
                    )}
                  >
                    {categoryLabel}
                  </span>
                  {esc.sequenceComplete && (
                    <span className="inline-flex items-center border border-amber-500/15 bg-amber-500/8 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                      Sequence complete
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <Link href={`/payment/${esc.paymentId}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="size-3" strokeWidth={1.5} />
                    View
                  </Button>
                </Link>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => handleResolve(esc.id)}
                >
                  <CheckCircle2 className="size-3" strokeWidth={1.5} />
                  Resolved
                </Button>
              </div>
            </div>

            <DraftEditor draft={draft} customerEmail={esc.customerEmail} />
          </div>
        );
      })}
    </div>
  );
}
