"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, ExternalLink } from "lucide-react";

import posthog from "posthog-js";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  { label: string; borderClass: string; badgeClass: string; dotClass: string }
> = {
  critical: {
    label: "Critical",
    borderClass: "border-l-red-500/70",
    badgeClass: "bg-red-500/10 text-red-400 border border-red-500/20",
    dotClass: "bg-red-500",
  },
  high: {
    label: "High",
    borderClass: "border-l-amber-500/70",
    badgeClass: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dotClass: "bg-amber-500",
  },
  normal: {
    label: "Normal",
    borderClass: "border-l-border",
    badgeClass: "bg-muted/50 text-muted-foreground border border-border",
    dotClass: "bg-muted-foreground",
  },
};

const CATEGORY_LABELS: Record<FailureCategory, string> = {
  expired_card: "Expired card",
  insufficient_funds: "Insufficient funds",
  compromised_card: "Compromised card",
  generic: "Declined",
};

const CATEGORY_BADGE: Record<FailureCategory, string> = {
  expired_card:
    "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  insufficient_funds: "bg-red-500/10 text-red-400 border border-red-500/20",
  compromised_card: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  generic: "bg-muted/40 text-muted-foreground border border-border",
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
      <Card className="border border-border">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <CheckCircle2 className="mb-4 size-10 text-emerald-400/60" />
          <p className="text-sm font-medium text-foreground">All clear</p>
          <p className="mt-1 text-xs text-muted-foreground">
            No accounts need your attention right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {escalations.map((esc) => {
        const config = PRIORITY_CONFIG[esc.priority];

        // Générer le draft côté client (module pur, pas de Node-only deps)
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

        const categoryLabel =
          CATEGORY_LABELS[draft.category] ?? esc.failureCode;
        const categoryBadge =
          CATEGORY_BADGE[draft.category] ?? CATEGORY_BADGE.generic;

        return (
          <Card
            key={esc.id}
            className={cn(
              "border border-l-4 border-border transition-colors",
              config.borderClass,
            )}
          >
            <CardContent className="pt-4 pb-4">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Priority + Name + Amount */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                        config.badgeClass,
                      )}
                    >
                      <span
                        className={cn("size-1.5 rounded-full", config.dotClass)}
                      />
                      {config.label}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {esc.customerName}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {formatAmount(esc.amount, esc.currency)}/mo
                    </span>
                    <span className="font-mono text-xs text-muted-foreground/60">
                      · {formatAmount(esc.annualValue, esc.currency)}/yr
                    </span>
                  </div>

                  {/* Context row */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" />
                      {esc.emailsSent} emails sent · no response
                    </span>
                    <span>{esc.daysSince}d ago</span>
                    {esc.tenureMonths > 0 && (
                      <span>{esc.tenureMonths}mo customer</span>
                    )}
                  </div>

                  {/* Category + sequence badges */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "inline-block rounded-none px-2 py-0.5 text-[10px] font-medium",
                        categoryBadge,
                      )}
                    >
                      {categoryLabel}
                    </span>
                    {esc.sequenceComplete && (
                      <span className="inline-flex items-center gap-1 rounded-none border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                        <AlertTriangle className="size-2.5" />
                        Sequence complete
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <Link href={`/payment/${esc.paymentId}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <ExternalLink className="size-3" />
                      View
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => handleResolve(esc.id)}
                  >
                    <CheckCircle2 className="size-3" />
                    Resolved
                  </Button>
                </div>
              </div>

              {/* Draft Editor */}
              <DraftEditor draft={draft} customerEmail={esc.customerEmail} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
