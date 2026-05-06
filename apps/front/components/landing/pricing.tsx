import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "./reveal";

const FEATURED_PLAN = {
  name: "Growth",
  badge: "Most popular",
  price: 149,
  description:
    "Built for founders at €20k–€80k MRR who need automation + escalation.",
  features: [
    "Up to €80k MRR covered",
    "Unlimited email sequences",
    "High-value account alerts",
    "Founder escalation drafts",
    "Priority scoring",
    "Recovery insights dashboard",
    "Unlimited team members",
  ],
} as const;

const OTHER_PLANS = [
  {
    name: "Solo",
    price: 19,
    description: "< €5k MRR · Getting started",
    features: ["Up to €5k MRR", "1 email sequence", "Basic dashboard"],
  },
  {
    name: "Starter",
    price: 149,
    description: "€5k–€20k MRR · Growing",
    features: ["Up to €20k MRR", "2 email sequences", "All Solo features"],
  },
] as const;

const SCALE_PLAN = {
  price: 399,
  features: [
    "Unlimited MRR covered",
    "All Growth features",
    "Custom integrations",
    "Priority support & SLA",
  ],
} as const;

export function PricingSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44" id="pricing">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-landing-accent">
            Pricing
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-6 font-display text-4xl leading-[1.08] text-landing-text md:text-5xl lg:text-6xl">
            Simple pricing.
            <br />
            <span className="italic text-landing-text-secondary">
              No % of MRR. No surprises.
            </span>
          </h2>
        </Reveal>

        {/* Beta banner */}
        <Reveal delay={180}>
          <div className="mt-10 flex items-center gap-4 border border-landing-accent/25 bg-landing-surface/30 px-6 py-3 backdrop-blur-sm sm:w-fit">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
              Beta
            </span>
            <span className="h-4 w-px bg-landing-border" aria-hidden />
            <p className="font-body text-sm text-landing-text-secondary">
              <span className="text-landing-text">All plans free</span> until
              launch — no billing during beta
            </p>
          </div>
        </Reveal>

        {/* Main pricing grid */}
        <Reveal delay={260}>
          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
            {/* Left: Solo + Starter compact list */}
            <div className="flex flex-col gap-4">
              {OTHER_PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="group flex flex-col justify-between gap-6 border border-landing-border bg-landing-surface/20 p-8 transition-all duration-300 hover:border-landing-border-strong hover:bg-landing-surface/40 sm:flex-row sm:items-center"
                >
                  <div>
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-2xl text-landing-text">
                        {plan.name}
                      </span>
                      <span className="font-display text-4xl text-landing-text">
                        €{plan.price}
                        <span className="font-body text-sm text-landing-text-muted">
                          /mo
                        </span>
                      </span>
                    </div>
                    <p className="mt-1 font-body text-sm text-landing-text-muted">
                      {plan.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                      {plan.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-1.5 font-body text-xs text-landing-text-secondary"
                        >
                          <Check className="size-3 shrink-0 text-landing-accent" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/beta"
                    className="group/btn shrink-0 inline-flex items-center justify-center gap-2 border border-landing-border px-6 py-3 font-body text-sm font-semibold text-landing-text transition-all duration-300 hover:border-landing-accent/30 hover:bg-landing-surface/60"
                  >
                    Join beta
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              ))}

              {/* Scale — enterprise row */}
              <div className="flex flex-col justify-between gap-6 border border-landing-border bg-landing-surface/10 p-8 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-baseline gap-4">
                    <span className="font-display text-2xl text-landing-text">
                      Scale
                    </span>
                    <span className="font-display text-4xl text-landing-text">
                      €399
                      <span className="font-body text-sm text-landing-text-muted">
                        /mo
                      </span>
                    </span>
                  </div>
                  <p className="mt-1 font-body text-sm text-landing-text-muted">
                    €80k+ MRR · Unlimited everything
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                    {SCALE_PLAN.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-1.5 font-body text-xs text-landing-text-secondary"
                      >
                        <Check className="size-3 shrink-0 text-landing-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/beta"
                  className="group/btn shrink-0 inline-flex items-center justify-center gap-2 border border-landing-border px-6 py-3 font-body text-sm font-semibold text-landing-text transition-all duration-300 hover:border-landing-accent/30 hover:bg-landing-surface/60"
                >
                  Join beta
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Right: Growth featured */}
            <div className="relative border border-landing-accent/35 bg-landing-surface/40 p-10 shadow-[inset_0_1px_0_rgba(0,232,123,0.08)] backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-landing-accent">
                  {FEATURED_PLAN.badge}
                </span>
                <span className="border border-landing-accent/25 bg-landing-accent/10 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-landing-accent">
                  Beta — free
                </span>
              </div>

              <div className="font-display text-3xl text-landing-text">
                {FEATURED_PLAN.name}
              </div>
              <p className="mt-2 font-body text-sm text-landing-text-secondary">
                {FEATURED_PLAN.description}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-6xl text-landing-text">
                  €{FEATURED_PLAN.price}
                </span>
                <span className="font-body text-sm text-landing-text-muted">
                  /month after launch
                </span>
              </div>

              <ul className="mt-8 space-y-3">
                {FEATURED_PLAN.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-landing-accent" />
                    <span className="font-body text-sm text-landing-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/beta"
                className="group mt-10 inline-flex w-full items-center justify-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,232,123,0.18)] active:scale-[0.98]"
              >
                Join the beta — free
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <p className="mt-4 text-center font-body text-xs text-landing-text-muted">
                No credit card · Cancel anytime
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={380}>
          <p className="mt-8 font-body text-xs text-landing-text-muted">
            Prices shown are post-launch. All plans free during beta.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
