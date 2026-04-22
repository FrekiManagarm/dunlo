import { TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { getDashboardData } from "@/actions/payments";
import { getSession } from "@/actions/auth";
import { DashboardClient } from "./dashboard-client";

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const data = await getDashboardData();

  return (
    <div className="app-page space-y-9">
      {/* Header */}
      <div className="app-row" style={{ "--delay": "0ms" } as React.CSSProperties}>
        <div className="flex items-start justify-between">
          <div>
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
              Recovery
            </p>
            <h1 className="font-display text-3xl tracking-tight text-foreground">
              Dashboard
            </h1>
          </div>
          {data.hasActiveFailedPayments && (
            <div className="flex items-center gap-2 border border-red-500/20 bg-red-500/5 px-3 py-2">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
                <span className="relative inline-flex size-1.5 rounded-full bg-red-400" />
              </span>
              <p className="text-[11px] font-medium text-red-400">
                {data.activeFailedCount} active · {formatAmount(data.activeFailedTotal, "eur")} at risk
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats strip — asymmetric, no equal cards */}
      <div
        className="app-row border-y border-white/[0.05]"
        style={{ "--delay": "60ms" } as React.CSSProperties}
      >
        <div className="grid grid-cols-[2fr_1px_1.2fr_1px_1.2fr]">
          {/* Primary — At risk */}
          <div className="py-6 pr-8">
            <div className="mb-3 flex items-center gap-2">
              <TrendingDown className="size-3.5 text-red-400" strokeWidth={1.75} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                At risk
              </span>
            </div>
            <p className="font-display text-4xl tracking-tight text-foreground">
              {formatAmount(data.stats.atRisk, "eur")}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Active failed payments
            </p>
          </div>

          {/* Divider */}
          <div className="bg-white/[0.05]" />

          {/* Secondary — Recovered */}
          <div className="py-6 px-8">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="size-3.5 text-primary" strokeWidth={1.75} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Recovered
              </span>
            </div>
            <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              {formatAmount(data.stats.recoveredThisMonth, "eur")}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">This month</p>
          </div>

          {/* Divider */}
          <div className="bg-white/[0.05]" />

          {/* Tertiary — Attention */}
          <div className="py-6 pl-8">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle className="size-3.5 text-amber-400" strokeWidth={1.75} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Attention
              </span>
            </div>
            <p className="font-mono text-2xl font-semibold tracking-tight text-foreground">
              {data.stats.needsAttention}
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground">Escalated accounts</p>
          </div>
        </div>
      </div>

      {/* Payments table */}
      <div className="app-row" style={{ "--delay": "120ms" } as React.CSSProperties}>
        <DashboardClient
          payments={data.payments}
          breakdown={data.stats.breakdown}
        />
      </div>
    </div>
  );
}
