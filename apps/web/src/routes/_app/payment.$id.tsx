import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Mail,
  MailOpen,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/payment/$id")({
  component: PaymentDetailPage,
});

interface TimelineEvent {
  step: number;
  label: string;
  date: string;
  status: "completed" | "opened" | "scheduled";
  detail?: string;
}

const mockTimeline: TimelineEvent[] = [
  {
    step: 1,
    label: "Recovery email sent",
    date: "Feb 27, 2026",
    status: "completed",
  },
  {
    step: 2,
    label: "Follow-up email sent",
    date: "Mar 2, 2026",
    status: "opened",
    detail: "Opened 2 hours ago",
  },
  {
    step: 3,
    label: "Final reminder",
    date: "Mar 6, 2026",
    status: "scheduled",
  },
];

const mockPayment = {
  id: "fp_1",
  customerName: "John Doe",
  customerEmail: "john@acme.co",
  amount: 29900,
  currency: "eur",
  failureReason: "Card expired",
  detectedAt: "Feb 27, 2026",
  daysSinceDetection: 3,
  status: "emailing" as const,
  currentStep: 2,
  totalSteps: 3,
};

function formatAmount(cents: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
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

  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <div className="absolute top-8 left-[13px] h-[calc(100%-24px)] w-px bg-border" />
      )}

      <div
        className={cn(
          "relative z-10 flex size-7 shrink-0 items-center justify-center border",
          colorMap[event.status],
        )}
      >
        {iconMap[event.status]}
      </div>

      <div className="flex-1 pt-0.5">
        <div className="flex items-baseline justify-between">
          <span
            className={cn(
              "text-xs font-medium",
              event.status === "scheduled"
                ? "text-muted-foreground"
                : "text-foreground",
            )}
          >
            {event.label}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {event.date}
          </span>
        </div>
        {event.detail && (
          <p className="mt-0.5 text-[11px] text-primary">{event.detail}</p>
        )}
      </div>
    </div>
  );
}

function PaymentDetailPage() {
  void Route.useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="font-display text-xl text-foreground">
            {mockPayment.customerName}
          </h1>
          <p className="text-xs text-muted-foreground">
            {formatAmount(mockPayment.amount, mockPayment.currency)}/mo
            &middot; {mockPayment.customerEmail}
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
              {mockPayment.failureReason}
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
              {mockPayment.daysSinceDetection} days ago
            </span>
            <p className="text-[11px] text-muted-foreground">
              {mockPayment.detectedAt}
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
                {mockPayment.status}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                (step {mockPayment.currentStep}/{mockPayment.totalSteps})
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-sm text-foreground">Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {mockTimeline.map((event, i) => (
              <TimelineItem
                key={event.step}
                event={event}
                isLast={i === mockTimeline.length - 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="default"
          size="lg"
          className="gap-2"
        >
          <CheckCircle2 className="size-3.5" />
          Mark as resolved
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="gap-2"
        >
          <AlertTriangle className="size-3.5" />
          Escalate manually
        </Button>
      </div>
    </div>
  );
}
