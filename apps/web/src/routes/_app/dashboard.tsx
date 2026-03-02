import { Link, createFileRoute } from "@tanstack/react-router";
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

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

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
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

interface MockPayment {
  id: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  currentStep: number;
  totalSteps: number;
  failureReason: string;
  detectedAt: string;
}

const mockPayments: MockPayment[] = [
  {
    id: "fp_1",
    customerName: "John Doe",
    customerEmail: "john@acme.co",
    amount: 29900,
    currency: "eur",
    status: "emailing",
    currentStep: 2,
    totalSteps: 3,
    failureReason: "Card expired",
    detectedAt: "2026-02-27",
  },
  {
    id: "fp_2",
    customerName: "Sara Martin",
    customerEmail: "sara@bigcorp.io",
    amount: 49900,
    currency: "eur",
    status: "escalated",
    currentStep: 3,
    totalSteps: 3,
    failureReason: "Insufficient funds",
    detectedAt: "2026-02-23",
  },
  {
    id: "fp_3",
    customerName: "Marc Dupont",
    customerEmail: "marc@startup.fr",
    amount: 9900,
    currency: "eur",
    status: "recovered",
    currentStep: 1,
    totalSteps: 3,
    failureReason: "Card expired",
    detectedAt: "2026-02-20",
  },
  {
    id: "fp_4",
    customerName: "Lisa Chen",
    customerEmail: "lisa@design.co",
    amount: 19900,
    currency: "eur",
    status: "emailing",
    currentStep: 1,
    totalSteps: 3,
    failureReason: "Authentication required",
    detectedAt: "2026-03-01",
  },
  {
    id: "fp_5",
    customerName: "Tom Wilson",
    customerEmail: "tom@agency.com",
    amount: 79900,
    currency: "eur",
    status: "lost",
    currentStep: 3,
    totalSteps: 3,
    failureReason: "Card declined",
    detectedAt: "2026-02-15",
  },
];

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

  const atRisk = mockPayments
    .filter((p) => p.status !== "recovered" && p.status !== "lost")
    .reduce((sum, p) => sum + p.amount, 0);

  const recovered = mockPayments
    .filter((p) => p.status === "recovered")
    .reduce((sum, p) => sum + p.amount, 0);

  const needsAttention = mockPayments.filter(
    (p) => p.status === "escalated",
  ).length;

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
          value={formatAmount(atRisk, "eur")}
          icon={TrendingDown}
          accent="red"
          subtitle="Active failed payments"
        />
        <StatCard
          title="Recovered this month"
          value={formatAmount(recovered, "eur")}
          icon={TrendingUp}
          accent="green"
          subtitle="Successfully recovered"
        />
        <StatCard
          title="Need your attention"
          value={String(needsAttention)}
          icon={AlertTriangle}
          accent="amber"
          subtitle="Escalated accounts"
        />
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">
            Recent failed payments
          </h2>
          <span className="text-xs text-muted-foreground">
            {mockPayments.length} total
          </span>
        </div>

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
              {mockPayments.map((payment) => (
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
      </div>
    </div>
  );
}
