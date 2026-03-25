import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "./reveal";

interface Plan {
  name: string;
  price: number;
  description: string;
  features: readonly string[];
  cta: string;
  highlighted: boolean;
}

function BetaPricingBanner() {
  return (
    <div className="mb-10 flex justify-center px-2">
      <div className="flex w-full max-w-2xl flex-col items-center gap-3 rounded-2xl border border-landing-accent/25 bg-landing-surface/40 px-6 py-4 backdrop-blur-sm sm:flex-row sm:justify-center sm:gap-5 sm:rounded-full sm:py-3">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-landing-accent">
          Beta
        </span>
        <span
          className="hidden h-4 w-px shrink-0 bg-landing-border sm:block"
          aria-hidden
        />
        <p className="text-center font-body text-sm leading-snug text-landing-text-secondary">
          <span className="text-landing-text">Free for now</span>
          <span className="text-landing-text-muted"> — </span>
          all plans, during beta
        </p>
      </div>
    </div>
  );
}

const plans: Plan[] = [
  {
    name: "Starter",
    price: 49,
    description: "For early-stage SaaS testing payment recovery",
    features: [
      "Up to €20k MRR covered",
      "Stripe integration",
      "2 email sequences",
      "Basic dashboard",
    ],
    cta: "Join the beta",
    highlighted: false,
  },
  {
    name: "Growth",
    price: 149,
    description: "For growing teams with higher volume",
    features: [
      "Up to €80k MRR covered",
      "All Starter features",
      "Unlimited email sequences",
      "High-value account alerts",
      "Unlimited team members",
    ],
    cta: "Join the beta",
    highlighted: true,
  },
  {
    name: "Scale",
    price: 399,
    description: "For established SaaS with high MRR",
    features: [
      "Unlimited MRR covered",
      "All Growth features",
      "Priority support",
      "Custom integrations",
    ],
    cta: "Join the beta",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-accent">
            Pricing
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-6 font-display text-4xl leading-[1.1] text-landing-text md:text-6xl">
            Simple pricing.
            <br />
            <span className="italic text-landing-text-secondary">
              No % of MRR. No surprises.
            </span>
          </h2>
        </Reveal>

        <Reveal delay={250}>
          <div className="mt-16">
            <BetaPricingBanner />
            <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col border p-8 backdrop-blur-sm transition-all duration-300 ${plan.highlighted
                    ? "border-landing-accent/40 bg-landing-surface/50"
                    : "border-landing-border bg-landing-surface/30"
                  }`}
              >
                <h3 className="font-display text-xl text-landing-text">
                  {plan.name}
                </h3>
                <p className="mt-2 font-body text-sm text-landing-text-secondary">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="font-display text-4xl text-landing-text">
                    €{plan.price}
                  </span>
                  <span className="font-body text-landing-text-muted">/mo</span>
                </div>

                <ul className="mt-8 flex-1 space-y-3">
                  {plan.features.map((feature) => (
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
                  className={`group mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 font-body text-sm font-semibold transition-all duration-300 ${plan.highlighted
                      ? "bg-landing-accent text-landing-bg hover:shadow-[0_0_30px_rgba(0,232,123,0.2)]"
                      : "border border-landing-border text-landing-text hover:border-landing-accent/30 hover:bg-landing-surface/50"
                    }`}
                >
                  {plan.cta}
                  <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </div>
            ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={350}>
          <p className="mt-10 text-center font-body text-sm text-landing-text-muted">
            Prices shown are for after launch.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
