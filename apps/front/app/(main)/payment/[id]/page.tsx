import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Clock,
  Mail,
  MailOpen,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getPaymentDetail,
  markPaymentResolved,
  escalatePayment,
} from "@/actions/payments";
import { getSession } from "@/actions/auth";
import { PaymentDetailClient } from "./payment-detail-client";

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function TimelineItem({
  event,
  isLast,
}: {
  event: {
    step: number;
    label: string;
    scheduledAt: string;
    sentAt: string | null;
    openedAt: string | null;
    status: string;
  };
  isLast: boolean;
}) {
  const displayStatus =
    event.status === "opened" || event.status === "clicked"
      ? "opened"
      : event.status === "sent"
        ? "completed"
        : event.status === "cancelled"
          ? "cancelled"
          : "scheduled";

  const iconMap = {
    completed: <Check className="size-3" />,
    opened: <MailOpen className="size-3" />,
    scheduled: <Clock className="size-3" />,
    cancelled: <Check className="size-3" />,
  };

  const colorMap = {
    completed: "bg-primary/10 text-primary border-primary/25",
    opened: "bg-primary/20 text-primary border-primary/40",
    scheduled: "bg-white/[0.03] text-muted-foreground border-white/[0.06]",
    cancelled: "bg-white/[0.03] text-muted-foreground/40 border-white/[0.04]",
  };

  const displayDate = event.sentAt
    ? new Date(event.sentAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : new Date(event.scheduledAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

  return (
    <div className="relative flex gap-4 py-4 border-b border-white/[0.04] last:border-0 last:pb-0">
      {!isLast && (
        <div className="absolute left-[13px] top-12 h-[calc(100%-3rem)] w-px bg-white/[0.04]" />
      )}

      <div
        className={cn(
          "relative z-10 flex size-7 shrink-0 items-center justify-center border",
          colorMap[displayStatus as keyof typeof colorMap],
        )}
      >
        {iconMap[displayStatus as keyof typeof iconMap]}
      </div>

      <div className="flex-1 pt-0.5">
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "text-[13px] font-medium",
              displayStatus === "scheduled" || displayStatus === "cancelled"
                ? "text-muted-foreground/60"
                : "text-foreground",
            )}
          >
            {event.label}
            {displayStatus === "cancelled" && (
              <span className="ml-1.5 text-[11px] text-muted-foreground/40">cancelled</span>
            )}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground/50">
            {displayDate}
          </span>
        </div>
        {event.openedAt && (
          <p className="mt-0.5 font-mono text-[11px] text-primary">
            Opened{" "}
            {new Date(event.openedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const payment = await getPaymentDetail(id);

  const isResolved =
    payment.status === "recovered" || payment.status === "lost";

  return (
    <div className="app-page space-y-8">
      {/* Header */}
      <div className="app-row" style={{ "--delay": "0ms" } as React.CSSProperties}>
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <ArrowLeft className="size-3" strokeWidth={1.5} />
          Dashboard
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight text-foreground">
              {payment.customerName}
            </h1>
            <p className="mt-1 font-mono text-[12px] text-muted-foreground">
              {payment.customerEmail}
              <span className="mx-2 text-white/[0.12]">·</span>
              {formatAmount(payment.amount, payment.currency)}/mo
            </p>
          </div>

          {!isResolved && (
            <PaymentDetailClient
              paymentId={payment.id}
              isEscalated={payment.isEscalated}
              markPaymentResolved={markPaymentResolved}
              escalatePayment={escalatePayment}
            />
          )}
        </div>
      </div>

      {/* Metadata strip — horizontal, no equal cards */}
      <div
        className="app-row border-y border-white/[0.05]"
        style={{ "--delay": "60ms" } as React.CSSProperties}
      >
        <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr]">
          <div className="py-5 pr-6">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
              Failure
            </p>
            <p className="text-[13px] font-medium text-foreground">
              {payment.failureReason}
            </p>
          </div>
          <div className="bg-white/[0.05]" />
          <div className="py-5 px-6">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
              Detected
            </p>
            <p className="text-[13px] font-medium text-foreground">
              {payment.daysSinceDetection}d ago
            </p>
            <p className="font-mono text-[11px] text-muted-foreground/50">
              {new Date(payment.detectedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="bg-white/[0.05]" />
          <div className="py-5 pl-6">
            <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">
              Status
            </p>
            <div className="flex items-center gap-1.5">
              <Mail className="size-3.5 text-amber-400" strokeWidth={1.5} />
              <span className="text-[13px] font-medium capitalize text-foreground">
                {payment.status}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground/50">
                step {payment.currentStep}/{payment.totalSteps}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div
        className="app-row"
        style={{ "--delay": "120ms" } as React.CSSProperties}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/40">
            Email timeline
          </p>
          <a
            href={`https://dashboard.stripe.com/payments/${payment.stripePaymentIntentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground/40 transition-colors hover:text-primary"
          >
            View in Stripe
            <ExternalLink className="size-3" strokeWidth={1.5} />
          </a>
        </div>

        {payment.timeline.length === 0 ? (
          <p className="py-8 text-center text-[11px] text-muted-foreground/40">
            No emails scheduled yet.
          </p>
        ) : (
          <div>
            {payment.timeline.map((event, i) => (
              <TimelineItem
                key={event.step}
                event={event}
                isLast={i === payment.timeline.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
