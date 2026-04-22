import { Clock, CreditCard, AlertCircle } from "lucide-react";

import { Reveal } from "./reveal";

const PAIN_POINTS = [
  {
    icon: CreditCard,
    title: "Card expired silently",
    desc: "Stripe retries fail. The customer never gets notified. The subscription lapses. You find out a week later when you check MRR.",
  },
  {
    icon: Clock,
    title: "Late discovery — too late to act",
    desc: "A €500/mo account fails at 2am. You notice it in your monthly report. The customer churned 10 days ago and has already moved on.",
  },
  {
    icon: AlertCircle,
    title: "No playbook by failure type",
    desc: "Expired card ≠ insufficient funds ≠ stolen card. A generic 'update your payment' email gets ignored. You need the right message for each failure.",
  },
] as const;

export function ProblemSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[260px_1fr] md:gap-24 lg:grid-cols-[320px_1fr] lg:gap-32">

          {/* Left: big stat */}
          <Reveal>
            <div className="md:sticky md:top-32">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-landing-accent">
                The problem
              </span>
              <div className="mt-6 font-display text-[5.5rem] leading-none text-landing-text lg:text-[7.5rem]">
                5–10%
              </div>
              <div className="mt-4 max-w-[220px] font-body text-sm leading-relaxed text-landing-text-muted">
                of MRR silently disappearing every month — across every SaaS on
                Stripe
              </div>
            </div>
          </Reveal>

          {/* Right: editorial + pain points */}
          <div>
            <Reveal delay={120}>
              <h2 className="font-display text-4xl leading-[1.08] text-landing-text md:text-5xl lg:text-6xl">
                Every month, you&apos;re losing money you don&apos;t{" "}
                <span className="italic text-landing-text-secondary">
                  even know about.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-10 space-y-5 border-l-2 border-landing-accent/30 pl-8">
                <p className="font-body text-lg leading-relaxed text-landing-text-secondary">
                  A card expires. Stripe retries a few times. The customer never
                  updates it. They churn silently.
                </p>
                <p className="font-body text-lg leading-relaxed text-landing-text-secondary">
                  Most SaaS founders lose 5–10% of MRR to failed payments. Not
                  because customers want to leave —{" "}
                  <strong className="font-semibold text-landing-text">
                    because nobody caught it in time.
                  </strong>
                </p>
              </div>
            </Reveal>

            <div className="mt-14">
              {PAIN_POINTS.map((point, i) => (
                <Reveal key={point.title} delay={300 + i * 100}>
                  <div className="flex items-start gap-6 border-t border-landing-border py-8">
                    <div className="mt-0.5 flex-shrink-0 border border-landing-border bg-landing-surface/40 p-3">
                      <point.icon className="size-5 text-landing-text-muted" />
                    </div>
                    <div>
                      <h3 className="font-body text-base font-semibold text-landing-text">
                        {point.title}
                      </h3>
                      <p className="mt-2 font-body text-sm leading-relaxed text-landing-text-secondary">
                        {point.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
