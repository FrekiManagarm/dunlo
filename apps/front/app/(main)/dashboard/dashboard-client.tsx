"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { cn, formatAmount } from "@/lib/utils";
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
    class: "text-emerald-400 bg-emerald-500/8 border-emerald-500/15",
    dot: "bg-emerald-400",
  },
  emailing: {
    label: "Emailing",
    class: "text-amber-400 bg-amber-500/8 border-amber-500/15",
    dot: "bg-amber-400",
  },
  escalated: {
    label: "Escalated",
    class: "text-red-400 bg-red-500/8 border-red-500/15",
    dot: "bg-red-400",
  },
  lost: {
    label: "Lost",
    class: "text-neutral-500 bg-neutral-500/8 border-neutral-500/15",
    dot: "bg-neutral-600",
  },
  detected: {
    label: "Detected",
    class: "text-blue-400 bg-blue-500/8 border-blue-500/15",
    dot: "bg-blue-400",
  },
} as const;

const CATEGORY_COLORS: Record<string, { bar: string; text: string }> = {
  expired_card: { bar: "bg-amber-500", text: "text-amber-400" },
  insufficient_funds: { bar: "bg-red-500", text: "text-red-400" },
  compromised_card: { bar: "bg-rose-500", text: "text-rose-400" },
  generic: { bar: "bg-muted-foreground/40", text: "text-muted-foreground" },
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
        "inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[10px] tracking-wider",
        config.class,
      )}
    >
      <span className={cn("size-1 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

function RecoveryBar({ score }: { score: number }) {
  const color =
    score >= 60 ? "bg-primary" : score >= 30 ? "bg-amber-500" : "bg-red-500/70";
  return (
    <div className="flex items-center gap-2">
      <div className="h-px w-14 overflow-hidden bg-white/[0.06]">
        <div className={cn("h-full transition-all", color)} style={{ width: `${score}%` }} />
      </div>
      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
        {score}%
      </span>
    </div>
  );
}

function BreakdownBar({ breakdown }: { breakdown: FailureBreakdown[] }) {
  if (breakdown.length === 0) return null;
  const total = breakdown.reduce((s, b) => s + b.count, 0);

  return (
    <div className="mb-7 border-b border-white/[0.05] pb-7">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
        Failure breakdown
      </p>
      <div className="space-y-2">
        {breakdown.map((item) => {
          const colors = CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.generic;
          const label = CATEGORY_LABELS[item.category] ?? item.category;
          const pct = total > 0 ? (item.count / total) * 100 : 0;

          return (
            <div key={item.category} className="flex items-center gap-4">
              <span className={cn("w-32 shrink-0 text-[11px] font-medium", colors.text)}>
                {label}
              </span>
              <div className="flex-1 overflow-hidden bg-white/[0.04] h-px">
                <div className={cn("h-full", colors.bar)} style={{ width: `${pct.toFixed(1)}%` }} />
              </div>
              <span className="w-6 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                {item.count}
              </span>
              <span
                className={cn(
                  "w-14 text-right font-mono text-[10px] tabular-nums",
                  item.recoveryRate >= 60
                    ? "text-primary"
                    : item.recoveryRate >= 30
                      ? "text-amber-400"
                      : "text-red-400",
                )}
              >
                {item.recoveryRate}% rec
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

  const filtered = filter === "all" ? payments : payments.filter((p) => p.status === filter);

  return (
    <div>
      <BreakdownBar breakdown={breakdown} />

      {/* Table header row */}
      <div className="mb-4 flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/50">
          Failed payments
        </p>
        <div className="flex items-center gap-px">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={cn(
                "px-2.5 py-1 font-mono text-[10px] tracking-wide transition-colors",
                filter === opt.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground/50 hover:text-muted-foreground",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-white/[0.05] py-20">
          <p className="text-[11px] text-muted-foreground/50">
            {filter === "all"
              ? "No failed payments detected yet."
              : `No payments with status "${filter}".`}
          </p>
        </div>
      ) : (
        <div className="border-t border-white/[0.05]">
          {/* Column headers */}
          <div className="grid grid-cols-[2fr_1fr_1.2fr_0.6fr_0.8fr_1fr_1.5rem] border-b border-white/[0.05] py-2.5">
            {["Customer", "Amount", "Reason", "Step", "Score", "Status"].map((h) => (
              <span key={h} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground/40">
                {h}
              </span>
            ))}
            <span />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.03]">
            {filtered.map((payment) => (
              <div
                key={payment.id}
                className="group grid grid-cols-[2fr_1fr_1.2fr_0.6fr_0.8fr_1fr_1.5rem] items-center py-3.5 transition-colors hover:bg-white/[0.015]"
              >
                <div>
                  <p className="text-[13px] font-medium text-foreground">
                    {payment.customerName}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60">
                    {payment.customerEmail}
                  </p>
                </div>
                <span className="font-mono text-[13px] tabular-nums text-foreground">
                  {formatAmount(payment.amount, payment.currency)}
                </span>
                <span className="text-[12px] text-muted-foreground">
                  {payment.failureReason}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">
                  {payment.currentStep}/{payment.totalSteps}
                </span>
                <RecoveryBar score={payment.recoveryScore} />
                <StatusBadge status={payment.status as keyof typeof statusConfig} />
                <Link
                  href={`/payment/${payment.id}`}
                  className="text-muted-foreground/20 transition-colors group-hover:text-muted-foreground/60 hover:!text-primary"
                >
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
