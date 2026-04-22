import Link from "next/link";
import { ArrowRight, Check, Minus, X } from "lucide-react";
import { Reveal } from "./reveal";

const COMPARISON_ROWS = [
  {
    feature: "Failure-specific sequences",
    dunlo: true,
    churnBuster: "partial",
    stripeRetries: false,
  },
  {
    feature: "Personal draft — one-click Gmail",
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

type CellValue = boolean | "partial";

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true)
    return <Check className="mx-auto size-3.5 text-landing-accent" />;
  if (value === "partial")
    return <Minus className="mx-auto size-3.5 text-landing-text-muted" />;
  return <X className="mx-auto size-3.5 text-landing-text-muted/50" />;
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-32">
      <div className="landing-hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div
          className="l-stagger mb-8 inline-flex items-center gap-2 border border-landing-border bg-landing-surface/60 px-4 py-1.5 font-medium uppercase tracking-[0.2em] text-landing-text-secondary backdrop-blur-sm"
          style={{ animationDelay: "100ms" }}
        >
          <span className="inline-block size-1.5 rounded-full bg-landing-accent" />
          Beta access — free to start
        </div>

        <h1
          className="l-stagger landing-headline font-display text-landing-text"
          style={{ animationDelay: "250ms" }}
        >
          Dunlo recovers the payments.
          <br />
          <span className="font-display italic text-landing-accent">
            You recover{" "}
          </span>
          the customers that matter.
        </h1>

        <p
          className="l-stagger mt-8 max-w-2xl font-body text-lg leading-relaxed text-landing-text-secondary md:text-xl"
          style={{ animationDelay: "400ms" }}
        >
          Automatic recovery by failure type. Personal drafts ready to send when
          a high-value account goes dark. 5-minute setup on Stripe.
        </p>

        <p
          className="l-stagger mt-4 font-body text-sm text-landing-text-muted"
          style={{ animationDelay: "450ms" }}
        >
          Built for founders at €5k–€80k MRR. Beta spots open — free until
          launch.
        </p>

        <div
          className="l-stagger mt-12 flex flex-col items-center gap-4"
          style={{ animationDelay: "550ms" }}
        >
          <Link
            href="/beta"
            className="group relative inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,232,123,0.25)]"
          >
            Join the beta — it&apos;s free to start
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <p className="font-body text-sm text-landing-text-muted">
            5 minute setup. Cancel anytime. No credit card required.
          </p>
        </div>

        {/* Mini comparison table */}
        <Reveal delay={700}>
          <div className="mt-14 overflow-hidden border border-landing-border/50 bg-landing-surface/20 backdrop-blur-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-landing-border/50">
                  <th className="py-2.5 pl-4 pr-3 text-left font-medium text-landing-text-muted">
                    &nbsp;
                  </th>
                  <th className="w-20 px-3 py-2.5 text-center font-semibold text-landing-accent">
                    Dunlo
                  </th>
                  <th className="w-28 px-3 py-2.5 text-center font-medium text-landing-text-muted">
                    Churn Buster
                  </th>
                  <th className="w-28 px-3 py-2.5 text-center font-medium text-landing-text-muted">
                    Stripe Retries
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i < COMPARISON_ROWS.length - 1
                        ? "border-b border-landing-border/30"
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
        </Reveal>
      </div>

      <div
        className="l-stagger absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animationDelay: "900ms" }}
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
