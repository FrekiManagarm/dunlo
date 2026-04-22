import Link from "next/link";
import { ArrowRight, Check, Minus, X, Zap, TrendingUp } from "lucide-react";

const COMPARISON_ROWS = [
  {
    feature: "Failure-specific sequences",
    dunlo: true,
    churnBuster: "partial" as const,
    stripeRetries: false,
  },
  {
    feature: "Personal draft — Gmail",
    dunlo: true,
    churnBuster: false,
    stripeRetries: false,
  },
  {
    feature: "Priority scoring",
    dunlo: true,
    churnBuster: false,
    stripeRetries: false,
  },
  {
    feature: "Recovery insights",
    dunlo: true,
    churnBuster: false,
    stripeRetries: false,
  },
] as const;

const MOCK_PAYMENTS = [
  {
    company: "Proxima SaaS",
    amount: "€240",
    reason: "card_expired",
    status: "recovering" as const,
  },
  {
    company: "Orbital Labs",
    amount: "€490",
    reason: "insufficient_funds",
    status: "emailing" as const,
  },
  {
    company: "Meridian HQ",
    amount: "€1,200",
    reason: "auth_required",
    status: "escalated" as const,
  },
];

function ComparisonCell({ value }: { value: boolean | "partial" }) {
  if (value === true)
    return <Check className="mx-auto size-3.5 text-landing-accent" />;
  if (value === "partial")
    return <Minus className="mx-auto size-3.5 text-landing-text-muted" />;
  return <X className="mx-auto size-3.5 text-landing-text-muted/40" />;
}

function StatusBadge({
  status,
}: {
  status: "recovering" | "emailing" | "escalated";
}) {
  const styles: Record<string, string> = {
    recovering:
      "text-landing-accent bg-landing-accent/10 border-landing-accent/20",
    emailing: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    escalated: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  };
  const labels: Record<string, string> = {
    recovering: "Recovering",
    emailing: "Emailing",
    escalated: "Escalated",
  };
  return (
    <span
      className={`border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wide ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden px-6 pb-20 pt-32 md:px-10 lg:pt-40">
      <div
        className="landing-hero-glow pointer-events-none absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/3"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px]">
          {/* Left: Headline + CTA */}
          <div>
            <div
              className="l-stagger mb-10 inline-flex items-center gap-2.5 border border-landing-border bg-landing-surface/60 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-landing-accent backdrop-blur-sm"
              style={{ animationDelay: "80ms" }}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-landing-accent" />
              Beta — free to start
            </div>

            <h1
              className="l-stagger landing-headline font-display text-landing-text"
              style={{ animationDelay: "180ms" }}
            >
              Stop losing revenue
              <br />
              to failed payments.
              <br />
              <span className="italic text-landing-accent">Automatically.</span>
            </h1>

            <p
              className="l-stagger mt-8 max-w-xl font-body text-lg leading-relaxed text-landing-text-secondary"
              style={{ animationDelay: "340ms" }}
            >
              Dunlo connects to Stripe, detects every failed payment by type,
              sends the right recovery email — and escalates high-value accounts
              directly to you. Setup in 5 minutes.
            </p>

            <div
              className="l-stagger mt-12 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "460ms" }}
            >
              <Link
                href="/beta"
                className="group relative inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] active:scale-[0.98]"
              >
                Join the beta — free
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#pricing"
                className="font-body text-sm text-landing-text-muted underline-offset-4 transition-colors hover:text-landing-text-secondary hover:underline"
              >
                See pricing
              </a>
            </div>

            <p
              className="l-stagger mt-5 font-body text-xs text-landing-text-muted"
              style={{ animationDelay: "520ms" }}
            >
              No credit card required · Cancel anytime · 5 min setup
            </p>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="l-stagger" style={{ animationDelay: "620ms" }}>
            <div className="border border-landing-border bg-landing-surface/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-landing-border px-6 py-4">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-landing-text-muted">
                  Recovery dashboard
                </span>
                <span className="flex items-center gap-1.5 font-body text-xs text-landing-accent">
                  <span className="size-1.5 animate-pulse rounded-full bg-landing-accent" />
                  Live
                </span>
              </div>

              <div className="flex items-end justify-between border-b border-landing-border px-6 py-5">
                <div>
                  <div className="mb-1 font-body text-xs text-landing-text-muted">
                    Recovered today
                  </div>
                  <div className="font-display text-4xl text-landing-accent">
                    €1,247
                  </div>
                </div>
                <div className="flex items-center gap-1 font-body text-xs text-landing-accent">
                  <TrendingUp className="size-3.5" />
                  +3 payments
                </div>
              </div>

              <div className="space-y-4 px-6 py-4">
                {MOCK_PAYMENTS.map((p) => (
                  <div
                    key={p.company}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-body text-sm font-medium text-landing-text">
                        {p.company}
                      </div>
                      <div className="font-mono font-body text-xs text-landing-text-muted">
                        {p.reason}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="font-body text-sm font-semibold text-landing-text">
                        {p.amount}
                      </span>
                      <StatusBadge status={p.status} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-landing-border px-6 py-3">
                <Zap className="size-3 shrink-0 text-landing-accent" />
                <span className="font-body text-xs text-landing-text-muted">
                  J+3 sequence sent · 2 accounts pending escalation
                </span>
              </div>
            </div>

            {/* Comparison table */}
            <div className="mt-3 border border-landing-border/40 bg-landing-bg/50 backdrop-blur-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-landing-border/40">
                    <th className="py-2.5 pl-4 pr-3 font-medium text-landing-text-muted">
                      &nbsp;
                    </th>
                    <th className="w-16 px-3 py-2.5 text-center font-semibold text-landing-accent">
                      Dunlo
                    </th>
                    <th className="w-24 px-3 py-2.5 text-center font-medium text-landing-text-muted">
                      Churn Buster
                    </th>
                    <th className="w-20 px-3 py-2.5 text-center font-medium text-landing-text-muted">
                      Stripe
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={
                        i < COMPARISON_ROWS.length - 1
                          ? "border-b border-landing-border/25"
                          : ""
                      }
                    >
                      <td className="py-2 pl-4 pr-3 text-landing-text-secondary">
                        {row.feature}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <ComparisonCell value={row.dunlo} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <ComparisonCell value={row.churnBuster} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <ComparisonCell value={row.stripeRetries} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="l-stagger absolute bottom-8 left-10 hidden lg:flex"
        style={{ animationDelay: "1100ms" }}
      >
        <div className="flex flex-col items-center gap-2 text-landing-text-muted">
          <span className="font-body text-xs uppercase tracking-widest">
            Scroll
          </span>
          <div className="h-8 w-px bg-linear-to-b from-landing-text-muted/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
