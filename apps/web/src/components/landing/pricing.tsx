import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";

import { Reveal } from "./reveal";

const features = [
  "Stripe integration",
  "Automated email sequences",
  "High-value account alerts",
  "Real-time payment monitoring",
  "Dashboard & analytics",
  "Unlimited team members",
] as const;

export function PricingSection() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <span className="font-body text-xs font-medium tracking-[0.25em] text-landing-accent uppercase">
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
          <div className="mt-16 border border-landing-border bg-landing-surface/30 p-10 backdrop-blur-sm md:p-14">
            <div className="flex flex-col items-center text-center">
              <span className="inline-flex items-center gap-2 border border-landing-accent/20 bg-landing-accent/5 px-4 py-1.5 font-body text-xs font-medium tracking-widest text-landing-accent uppercase">
                Beta access
              </span>

              <div className="mt-8 flex items-baseline gap-1">
                <span className="font-display text-7xl text-landing-text md:text-8xl">
                  $0
                </span>
                <span className="font-body text-landing-text-muted">/mo</span>
              </div>

              <p className="mt-3 font-body text-sm text-landing-text-secondary">
                Free during the beta. No credit card required.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-md">
              <ul className="grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="size-4 shrink-0 text-landing-accent" />
                    <span className="font-body text-sm text-landing-text-secondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <Link
                to="/login"
                search={{ mode: "sign-up" }}
                className="group inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,232,123,0.25)]"
              >
                Start recovering revenue
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
