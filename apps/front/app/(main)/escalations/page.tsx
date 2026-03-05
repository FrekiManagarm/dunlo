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
            didn&apos;t work, they need a human touch.
          </p>
        </div>
      </div>

      <EscalationsClient
        escalations={escalationsList}
        onResolve={resolveEscalation}
      />
    </div>
  );
}
