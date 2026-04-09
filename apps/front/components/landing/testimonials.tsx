import { Reveal } from "./reveal";

const testimonials = [
  {
    quote:
      "Set up in 8 minutes. Recovered €1,200 in the first week. The draft email for my biggest client was word-perfect — I just clicked send.",
    author: "Thomas R.",
    role: "Founder, B2B analytics SaaS",
    mrr: "€18k MRR",
  },
  {
    quote:
      "I was losing €800/mo without knowing it. Dunlo caught 4 expired cards in the first 24 hours. One of them was my best account.",
    author: "Sarah M.",
    role: "Solo founder, HR tool",
    mrr: "€9k MRR",
  },
  {
    quote:
      "The escalation feature is the one I didn't know I needed. It told me exactly who to call, what to say, and why. Saved a €490/mo account in a single email.",
    author: "Marc D.",
    role: "Co-founder, project management SaaS",
    mrr: "€32k MRR",
  },
] as const;

export function TestimonialsSection() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-accent">
            Founders say
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-6 max-w-xl font-display text-4xl leading-[1.1] text-landing-text md:text-5xl">
            Real results from{" "}
            <span className="italic text-landing-accent">real founders.</span>
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.author} delay={200 + i * 100}>
              <div className="flex h-full flex-col border border-landing-border bg-landing-surface/30 p-8">
                <blockquote className="mb-6 flex-1 font-display text-lg italic leading-relaxed text-landing-text">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <footer className="mt-auto">
                  <div className="mb-2 h-px w-full bg-linear-to-r from-landing-border to-transparent" />
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-landing-text">
                        {t.author}
                      </p>
                      <p className="text-xs text-landing-text-muted">
                        {t.role}
                      </p>
                    </div>
                    <span className="shrink-0 border border-landing-accent/30 bg-landing-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-landing-accent">
                      {t.mrr}
                    </span>
                  </div>
                </footer>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
