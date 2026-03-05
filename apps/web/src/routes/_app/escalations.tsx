import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { AlertTriangle, ExternalLink, CheckCircle2, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEscalations, resolveEscalation } from "@/functions/payments";

export const Route = createFileRoute("/_app/escalations")({
  component: EscalationsPage,
  loader: () => getEscalations(),
});

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function EscalationsPage() {
  const escalationsList = Route.useLoaderData();
  const router = useRouter();

  async function handleResolve(escalationId: string) {
    await resolveEscalation({ data: { escalationId } });
    router.invalidate();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center border border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="size-4 text-amber-400" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground">
            Needs your attention
          </h1>
          <p className="text-xs text-muted-foreground">
            {escalationsList.length} escalated account
            {escalationsList.length !== 1 ? "s" : ""} — automated recovery
            didn't work, they need a human touch.
          </p>
        </div>
      </div>

      {escalationsList.length === 0 ? (
        <Card className="border border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckCircle2 className="mb-4 size-10 text-emerald-400/60" />
            <p className="text-sm font-medium text-foreground">
              All clear
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              No accounts need your attention right now.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {escalationsList.map((esc) => (
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
                  <Link to="/payment/$id" params={{ id: esc.paymentId }}>
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
      )}
    </div>
  );
}
