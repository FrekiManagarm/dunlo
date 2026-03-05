import { Activity, Mail, AlertTriangle } from "lucide-react";

import { Reveal } from "./reveal";

const features = [
  {
    step: "01",
    icon: Activity,
    title: "Detects",
    description:
      "Dunlo connects to Stripe and flags every failed payment in real time. No more discovering it a week later.",
  },
  {
    step: "02",
    icon: Mail,
    title: "Recovers",
    description:
      "Dunlo sends smart email sequences based on the failure type. Expired card? Different message than insufficient funds. No generic 'please update your card' emails.",
  },
  {
    step: "03",
    icon: AlertTriangle,
    title: "Escalates",
    description:
      "High-value account not responding? Dunlo alerts you directly with full context — who, how much, since when. So you can step in before it's too late.",
  },
] as const;

export function SolutionSection() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-accent">
            How it works
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-6 max-w-3xl font-display text-4xl leading-[1.1] text-landing-text md:text-6xl lg:text-7xl">
            Dunlo catches what you miss.{" "}
            <span className="italic text-landing-accent">Automatically.</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.step} delay={200 + i * 120}>
              <div className="group relative flex h-full flex-col border border-landing-border bg-landing-surface/30 p-8 transition-all duration-500 hover:border-landing-accent/20 hover:bg-landing-surface/60">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-body text-xs tracking-widest text-landing-text-muted">
                    {feature.step}
                  </span>
                  <feature.icon className="size-5 text-landing-text-muted transition-colors duration-500 group-hover:text-landing-accent" />
                </div>

                <h3 className="mb-4 font-display text-3xl text-landing-text">
                  {feature.title}
                </h3>

                <p className="font-body text-sm leading-relaxed text-landing-text-secondary">
                  {feature.description}
                </p>

                <div className="mt-auto pt-8">
                  <div className="h-px w-full bg-linear-to-r from-landing-accent/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-16 text-center font-body text-lg font-medium text-landing-accent">
            10 minutes to connect. Zero complexity. No dedicated team needed.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
