import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "red" | "green" | "amber";
  subtitle?: string;
}) {
  const accentClasses = {
    red: "text-red-400 bg-red-500/10 border-red-500/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <Card className="border border-border bg-card">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div
          className={cn(
            "flex size-8 items-center justify-center border",
            accentClasses[accent],
          )}
        >
          <Icon className="size-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Welcome back, {session.user.name}. Here&apos;s your payment recovery
          overview.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="At risk"
          value={formatAmount(data.stats.atRisk, "eur")}
          icon={TrendingDown}
          accent="red"
          subtitle="Active failed payments"
        />
        <StatCard
          title="Recovered this month"
          value={formatAmount(data.stats.recoveredThisMonth, "eur")}
          icon={TrendingUp}
          accent="green"
          subtitle="Successfully recovered"
        />
        <StatCard
          title="Need your attention"
          value={String(data.stats.needsAttention)}
          icon={AlertTriangle}
          accent="amber"
          subtitle="Escalated accounts"
        />
      </div>

      <DashboardClient payments={data.payments} />
    </div>
  );
}
