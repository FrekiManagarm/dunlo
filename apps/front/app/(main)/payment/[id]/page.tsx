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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
        : "scheduled";

  const iconMap = {
    completed: <Check className="size-3" />,
    opened: <MailOpen className="size-3" />,
    scheduled: <Clock className="size-3" />,
  };

  const colorMap = {
    completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    opened: "bg-primary/20 text-primary border-primary/30",
    scheduled: "bg-muted text-muted-foreground border-border",
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
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute top-8 left-[13px] h-[calc(100%-24px)] w-px bg-border" />
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
              "text-xs font-medium",
              displayStatus === "scheduled"
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {event.label}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {displayDate}
          </span>
        </div>
        {event.openedAt && (
          <p className="mt-0.5 text-[11px] text-primary">
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="font-display text-xl text-foreground">
            {payment.customerName}
          </h1>
          <p className="text-xs text-muted-foreground">
            {formatAmount(payment.amount, payment.currency)}/mo
            &middot; {payment.customerEmail}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              Failure reason
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-medium text-foreground">
              {payment.failureReason}
            </span>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm font-medium text-foreground">
              {payment.daysSinceDetection} days ago
            </span>
            <p className="text-[11px] text-muted-foreground">
              {new Date(payment.detectedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="text-xs text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Mail className="size-3.5 text-amber-400" />
              <span className="text-sm font-medium capitalize text-foreground">
                {payment.status}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                (step {payment.currentStep}/{payment.totalSteps})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-sm text-foreground">Timeline</CardTitle>
          <a
            href={`https://dashboard.stripe.com/payments/${payment.stripePaymentIntentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            View in Stripe
            <ExternalLink className="size-3" />
          </a>
        </CardHeader>
        <CardContent>
          {payment.timeline.length === 0 ? (
            <p className="text-xs text-muted-foreground">
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
        </CardContent>
      </Card>

      {!isResolved && (
        <PaymentDetailClient
          paymentId={payment.id}
          isEscalated={payment.isEscalated}
          markPaymentResolved={markPaymentResolved}
          escalatePayment={escalatePayment}
        />
      )}
    </div>
  );
}
