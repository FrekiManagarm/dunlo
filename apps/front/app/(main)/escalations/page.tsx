import { redirect } from "next/navigation";
import { getEscalations, resolveEscalation } from "@/actions/payments";
import { getSession } from "@/actions/auth";
import { EscalationsClient } from "./escalations-client";

export default async function EscalationsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const escalationsList = await getEscalations();

  const criticalCount = escalationsList.filter((e) => e.priority === "critical").length;
  const highCount = escalationsList.filter((e) => e.priority === "high").length;

  return (
    <div className="app-page space-y-9">
      <div className="app-row" style={{ "--delay": "0ms" } as React.CSSProperties}>
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
              Escalations
            </p>
            <h1 className="font-display text-3xl tracking-tight text-foreground">
              Needs attention
            </h1>
            <p className="mt-2 text-[12px] text-muted-foreground">
              {escalationsList.length === 0
                ? "All clear — no accounts need your attention."
                : `${escalationsList.length} account${escalationsList.length !== 1 ? "s" : ""} where automated recovery didn't work.`}
            </p>
          </div>

          {escalationsList.length > 0 && (
            <div className="flex items-center gap-2">
              {criticalCount > 0 && (
                <span className="inline-flex items-center gap-1.5 border border-red-500/20 bg-red-500/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-red-400">
                  <span className="size-1 rounded-full bg-red-400" />
                  {criticalCount} critical
                </span>
              )}
              {highCount > 0 && (
                <span className="inline-flex items-center gap-1.5 border border-amber-500/20 bg-amber-500/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-amber-400">
                  <span className="size-1 rounded-full bg-amber-400" />
                  {highCount} high
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="app-row" style={{ "--delay": "60ms" } as React.CSSProperties}>
        <EscalationsClient
          escalations={escalationsList}
          onResolve={resolveEscalation}
        />
      </div>
    </div>
  );
}
