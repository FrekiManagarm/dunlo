import { Link, createFileRoute } from "@tanstack/react-router";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getDashboardData } from "@/functions/payments";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
  loader: () => getDashboardData(),
});

const statusConfig = {
  recovered: {
    label: "Recovered",
    class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  emailing: {
    label: "Emailing",
    class: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    dot: "bg-amber-400",
  },
  escalated: {
    label: "Escalated",
    class: "bg-red-500/10 text-red-400 border-red-500/20",
    dot: "bg-red-400",
  },
  lost: {
    label: "Lost",
    class: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
    dot: "bg-neutral-500",
  },
  detected: {
    label: "Detected",
    class: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    dot: "bg-blue-400",
  },
} as const;

type PaymentStatus = keyof typeof statusConfig;

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "emailing", label: "Emailing" },
  { value: "escalated", label: "Escalated" },
  { value: "recovered", label: "Recovered" },
  { value: "lost", label: "Lost" },
  { value: "detected", label: "Detected" },
] as const;

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function StatusBadge({ status }: { status: PaymentStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        config.class,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
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

function DashboardPage() {
  const { session } = Route.useRouteContext();
  const data = Route.useLoaderData();
  const [filter, setFilter] = useState<string>("all");

  const filteredPayments =
    filter === "all"
      ? data.payments
      : data.payments.filter((p) => p.status === filter);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Welcome back, {session?.user.name}. Here's your payment recovery
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

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">
            Failed payments
          </h2>
          <div className="flex items-center gap-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFilter(opt.value)}
                className={cn(
                  "px-2.5 py-1 text-[11px] font-medium transition-colors",
                  filter === opt.value
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "No failed payments detected yet. Connect Stripe to get started."
                  : `No payments with status "${filter}".`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden border border-border">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">
                    Customer
                  </TableHead>
                  <TableHead className="text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-muted-foreground">Reason</TableHead>
                  <TableHead className="text-muted-foreground">Step</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="group border-border transition-colors hover:bg-muted/30"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium text-foreground">
                          {payment.customerName}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {payment.customerEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-foreground">
                      {formatAmount(payment.amount, payment.currency)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.failureReason}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-muted-foreground">
                        {payment.currentStep}/{payment.totalSteps}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>
                      <Link
                        to="/payment/$id"
                        params={{ id: payment.id }}
                        className="inline-flex items-center text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-primary"
                      >
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
