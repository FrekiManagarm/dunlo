"use client";

import Link from "next/link";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatAmount } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import type { FailureBreakdown, TablePayment } from "@/actions/payments";

const FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "emailing", label: "Emailing" },
  { value: "escalated", label: "Escalated" },
  { value: "recovered", label: "Recovered" },
  { value: "lost", label: "Lost" },
  { value: "detected", label: "Detected" },
] as const;

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

const CATEGORY_COLORS: Record<
  string,
  { bar: string; text: string; bg: string }
> = {
  expired_card: {
    bar: "bg-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  insufficient_funds: {
    bar: "bg-red-500",
    text: "text-red-400",
    bg: "bg-red-500/10",
  },
  compromised_card: {
    bar: "bg-rose-500",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  generic: {
    bar: "bg-muted-foreground/50",
    text: "text-muted-foreground",
    bg: "bg-muted/40",
  },
};

const CATEGORY_LABELS: Record<string, string> = {
  expired_card: "Expired card",
  insufficient_funds: "Insufficient funds",
  compromised_card: "Compromised",
  generic: "Other",
};

function StatusBadge({ status }: { status: keyof typeof statusConfig }) {
  const config = statusConfig[status] ?? statusConfig.detected;
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

function RecoveryScoreBar({ score }: { score: number }) {
  const color =
    score >= 60
      ? "bg-emerald-500"
      : score >= 30
        ? "bg-amber-500"
        : "bg-red-500/70";
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1 w-16 overflow-hidden rounded-full bg-muted/40">
        <div
          className={cn("h-full transition-all duration-500", color)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">
        {score}%
      </span>
    </div>
  );
}

function BreakdownSection({ breakdown }: { breakdown: FailureBreakdown[] }) {
  if (breakdown.length === 0) return null;
  const totalCount = breakdown.reduce((sum, b) => sum + b.count, 0);

  return (
    <div className="mb-6 border border-border p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Failure breakdown
      </p>
      <div className="space-y-2.5">
        {breakdown.map((item) => {
          const colors = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.generic;
          const label = CATEGORY_LABELS[item.category] ?? item.category;
          const widthPct =
            totalCount > 0 ? (item.count / totalCount) * 100 : 0;

          return (
            <div key={item.category} className="flex items-center gap-3">
              <span
                className={cn(
                  "w-28 shrink-0 text-[11px] font-medium",
                  colors.text,
                )}
              >
                {label}
              </span>
              <div className="flex-1 overflow-hidden rounded-none bg-muted/20 h-1.5">
                <div
                  className={cn("h-full", colors.bar)}
                  style={{ width: `${widthPct.toFixed(1)}%` }}
                />
              </div>
              <span className="w-8 text-right font-mono text-[10px] text-muted-foreground">
                {item.count}
              </span>
              <span
                className={cn(
                  "w-16 text-right text-[10px] font-medium",
                  item.recoveryRate >= 60
                    ? "text-emerald-400"
                    : item.recoveryRate >= 30
                      ? "text-amber-400"
                      : "text-red-400",
                )}
              >
                {item.recoveryRate}% rec.
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DashboardClient({
  payments,
  breakdown,
}: {
  payments: TablePayment[];
  breakdown: FailureBreakdown[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((p) => p.status === filter);

  return (
    <div>
      <BreakdownSection breakdown={breakdown} />

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
                <TableHead className="text-muted-foreground">Customer</TableHead>
                <TableHead className="text-muted-foreground">Amount</TableHead>
                <TableHead className="text-muted-foreground">Reason</TableHead>
                <TableHead className="text-muted-foreground">Step</TableHead>
                <TableHead className="text-muted-foreground">Score</TableHead>
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
                    <RecoveryScoreBar score={payment.recoveryScore} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={payment.status as keyof typeof statusConfig}
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/payment/${payment.id}`}
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
  );
}
