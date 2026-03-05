"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, ExternalLink, CheckCircle2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatAmount } from "@/lib/utils";

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
      {escalations.map((esc) => (
        <Card
          key={esc.id}
          className="group border border-border transition-colors hover:border-border-strong"
        >
          <CardContent className="flex items-start justify-between gap-4 pt-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-medium text-foreground">
                  {esc.customerName}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatAmount(esc.amount, esc.currency)}/mo
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3" />
                  {esc.emailsSent} emails sent. No response.
                </span>
                <span>Since {esc.daysSince} days.</span>
              </div>

              {esc.sequenceComplete && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-amber-400">
                  <AlertTriangle className="size-3" />
                  Sequence complete
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/payment/${esc.paymentId}`}>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="size-3" />
                  View details
                </Button>
              </Link>
              <Button
                variant="default"
                size="sm"
                className="gap-1.5"
                onClick={() => handleResolve(esc.id)}
              >
                <CheckCircle2 className="size-3" />
                Mark resolved
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
