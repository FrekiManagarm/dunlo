import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getEscalations, resolveEscalation } from "@/actions/payments";
import { getSession } from "@/actions/auth";
import { EscalationsClient } from "./escalations-client";

export default async function EscalationsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const escalationsList = await getEscalations();

  const criticalCount = escalationsList.filter(
    (e) => e.priority === "critical",
  ).length;
  const highCount = escalationsList.filter((e) => e.priority === "high").length;
  const normalCount = escalationsList.filter(
    (e) => e.priority === "normal",
  ).length;

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center border border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="size-4 text-amber-400" />
        </div>
        <div className="space-y-1">
          <h1 className="font-display text-2xl text-foreground">
            Needs your attention
          </h1>
          <p className="text-xs text-muted-foreground">
            {escalationsList.length} escalated account
            {escalationsList.length !== 1 ? "s" : ""} — automated recovery
            didn&apos;t work, they need a human touch.
          </p>
          {escalationsList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {criticalCount > 0 && (
                <span className="inline-flex items-center gap-1 border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-400">
                  <span className="size-1.5 rounded-full bg-red-500" />
                  {criticalCount} critical
                </span>
              )}
              {highCount > 0 && (
                <span className="inline-flex items-center gap-1 border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-400">
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  {highCount} high
                </span>
              )}
              {normalCount > 0 && (
                <span className="inline-flex items-center gap-1 border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-muted-foreground" />
                  {normalCount} normal
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <EscalationsClient
        escalations={escalationsList}
        onResolve={resolveEscalation}
      />
    </div>
  );
}
