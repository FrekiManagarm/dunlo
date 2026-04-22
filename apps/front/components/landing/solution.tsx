import { Activity, Mail, AlertTriangle, TrendingUp } from "lucide-react";

import { Reveal } from "./reveal";

const STEPS = [
  {
    step: "01",
    icon: Activity,
    title: "Detects",
    headline: "Real-time failure detection by type",
    description:
      "Dunlo connects to Stripe and flags every failed payment the moment it happens. Expired card, insufficient funds, stolen card, 3DS required — each type gets its own playbook. No more discovering it a week later.",
  },
  {
    step: "02",
    icon: Mail,
    title: "Recovers",
    headline: "Smart sequences, not generic dunning",
    description:
      "Automated email sequences tailored to the failure type. Not a generic 'update your card' blast — the right message, at the right time, with the right tone. Sent from your domain, on your behalf.",
  },
  {
    step: "03",
    icon: AlertTriangle,
    title: "Escalates",
    headline: "High-value accounts surface automatically",
    description:
      "High-value account not responding after 3 emails? Dunlo scores it, surfaces it, and generates a personalized draft — ready to send from your Gmail in one click. You stay in the loop only when it matters.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Insights",
    headline: "Know exactly where you're leaking",
    description:
      "Recovery rate by failure type. Which customers respond fastest. Which sequences convert. So you know where to act next — and can prevent issues before they compound.",
  },
] as const;

export function SolutionSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[300px_1fr] lg:grid-cols-[360px_1fr]">

          {/* Left: sticky header */}
          <div>
            <Reveal>
              <div className="md:sticky md:top-32">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-landing-accent">
                  How it works
                </span>
                <h2 className="mt-6 font-display text-4xl leading-[1.08] text-landing-text md:text-5xl">
                  Automation when it works.{" "}
                  <span className="italic text-landing-accent">
                    You, when it matters.
                  </span>
                </h2>
                <p className="mt-6 font-body text-sm leading-relaxed text-landing-text-muted">
                  5 minutes to connect. Zero complexity. No dedicated team
                  needed.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right: timeline steps */}
          <div className="relative pl-10 md:pl-14">
            {/* Vertical connecting line */}
            <div
              className="pointer-events-none absolute left-[calc(0px+0.75rem)] top-4 bottom-4 w-px bg-linear-to-b from-landing-border via-landing-border to-transparent"
              aria-hidden
            />

            <div className="space-y-0">
              {STEPS.map((step, i) => (
                <Reveal key={step.step} delay={i * 130}>
                  <div className="group relative pb-16 last:pb-0">
                    {/* Step circle */}
                    <div className="absolute -left-10 top-0 flex size-7 items-center justify-center border border-landing-border bg-landing-bg font-body text-[10px] font-semibold text-landing-text-muted transition-colors duration-300 group-hover:border-landing-accent/40 group-hover:text-landing-accent md:-left-14">
                      {step.step}
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr] lg:gap-10">
                      <div>
                        <div className="mb-3 flex items-center gap-3">
                          <step.icon className="size-4 text-landing-text-muted transition-colors duration-300 group-hover:text-landing-accent" />
                          <span className="font-body text-xs font-semibold uppercase tracking-widest text-landing-text-muted">
                            {step.title}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl leading-tight text-landing-text lg:text-3xl">
                          {step.headline}
                        </h3>
                      </div>
                      <p className="font-body text-base leading-relaxed text-landing-text-secondary lg:pt-1">
                        {step.description}
                      </p>
                    </div>

                    {/* Hover accent line */}
                    <div className="mt-8 h-px w-full bg-linear-to-r from-landing-accent/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
