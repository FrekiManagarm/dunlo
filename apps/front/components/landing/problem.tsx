import { Reveal, CountUp } from "./reveal";

export function ProblemSection() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-accent">
            The problem
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] text-landing-text md:text-6xl lg:text-7xl">
            Every month, you&apos;re losing money you don&apos;t even{" "}
            <span className="italic text-landing-text-secondary">know about.</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-16 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-3">
            <Reveal delay={200}>
              <div className="space-y-6 border-l border-landing-border pl-8">
                <p className="font-body text-lg leading-relaxed text-landing-text-secondary">
                  A card expires. Stripe retries. The customer never updates it.
                  They churn silently.
                </p>
                <p className="font-body text-lg leading-relaxed text-landing-text-secondary">
                  A payment fails at 2am. You find out a week later when you
                  check your MRR. A €500/mo account goes dark. You send a manual
                  email. Too late.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="flex items-center md:col-span-2">
            <Reveal delay={350}>
              <div className="flex w-full flex-col items-center border border-landing-border bg-landing-surface/40 p-10 text-center backdrop-blur-sm">
                <span className="font-display text-7xl text-landing-accent md:text-8xl">
                  <CountUp end={5} suffix="–10" />%
                </span>
                <span className="mt-3 font-body text-sm uppercase tracking-wide text-landing-text-muted">
                  of MRR silently disappearing
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={200}>
          <div className="mt-20 border-t border-landing-border pt-10">
            <p className="max-w-2xl font-body text-base leading-relaxed text-landing-text-secondary">
              <strong className="font-semibold text-landing-text">
                Most SaaS founders lose 5-10% of MRR to failed payments.
              </strong>{" "}
              Not because customers want to leave — because nobody caught it in
              time.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
