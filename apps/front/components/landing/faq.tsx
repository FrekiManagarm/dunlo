"use client";

import { ChevronDown } from "lucide-react";

import { Reveal } from "./reveal";

const FAQS = [
  {
    question: "Does Dunlo work with Stripe Connect?",
    answer:
      "Yes. Dunlo connects to both standard Stripe accounts and Stripe Connect platforms. We read your payment intents and customer data to detect failed payments and trigger recovery flows.",
  },
  {
    question: "What happens after the beta?",
    answer:
      "During beta, every plan is free. When we launch, you'll pick the tier that fits (Solo €19/mo, Starter €49/mo, Growth €149/mo, or Scale €399/mo). We'll give you a heads-up before any billing starts.",
  },
  {
    question: "Will my recovery emails go to spam?",
    answer:
      "Dunlo sends from your domain via your own email provider (Resend, SendGrid, etc.). You control deliverability. We avoid spam-trigger words and our templates are written for high inbox placement.",
  },
  {
    question: "How long does setup take?",
    answer:
      "About 5 minutes: connect Stripe, add your email provider, review the default sequences. No code, no engineering team needed. Customize sequences any time after.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No lock-in. During beta there's nothing to cancel. After launch, you can downgrade or pause at any time.",
  },
] as const;

export function FAQSection() {
  return (
    <section className="relative px-6 py-32 md:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-[280px_1fr] lg:grid-cols-[340px_1fr]">

          {/* Left: section header */}
          <Reveal>
            <div className="md:sticky md:top-32">
              <span className="font-body text-xs font-semibold uppercase tracking-[0.25em] text-landing-accent">
                FAQ
              </span>
              <h2 className="mt-6 font-display text-4xl leading-[1.08] text-landing-text md:text-5xl">
                Common questions
              </h2>
              <p className="mt-4 font-body text-sm leading-relaxed text-landing-text-muted">
                Anything else? Email us at{" "}
                <a
                  href="mailto:hello@dunlo.io"
                  className="text-landing-text-secondary underline underline-offset-4 transition-colors hover:text-landing-text"
                >
                  hello@dunlo.io
                </a>
              </p>
            </div>
          </Reveal>

          {/* Right: accordion */}
          <Reveal delay={150}>
            <div>
              {FAQS.map((faq, i) => (
                <details
                  key={faq.question}
                  className={`group border-b border-landing-border transition-colors last:border-b ${
                    i === 0 ? "border-t" : ""
                  }`}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 font-body text-base font-medium text-landing-text transition-colors hover:text-landing-text [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown className="size-4 shrink-0 text-landing-text-muted transition-transform duration-200 group-open:rotate-180" />
                  </summary>
                  <div className="pb-6 pr-8">
                    <p className="font-body text-sm leading-relaxed text-landing-text-secondary">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
