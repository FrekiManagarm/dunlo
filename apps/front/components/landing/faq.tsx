"use client";

import { ChevronDown } from "lucide-react";

import { Reveal } from "./reveal";

const faqs = [
  {
    question: "Does Dunlo work with Stripe Connect?",
    answer:
      "Yes. Dunlo connects to both standard Stripe accounts and Stripe Connect platforms. We read your payment intents and customer data to detect failed payments and trigger recovery flows.",
  },
  {
    question: "What happens after the beta?",
    answer:
      "During beta, the Growth plan is free. When we launch, you'll be able to stay on Growth at €149/mo or switch to Starter (€49/mo) or Scale (€399/mo). We'll give you a heads-up before any billing starts.",
  },
  {
    question: "Will my recovery emails go to spam?",
    answer:
      "Dunlo sends from your domain via your own email provider (we integrate with Resend, SendGrid, etc.). You control deliverability. We also recommend SPF/DKIM setup and avoid spam-trigger words — our templates are written for high inbox placement.",
  },
  {
    question: "How long does setup take?",
    answer:
      "About 10 minutes: connect Stripe, add your email provider, review the default sequences. No code, no engineering team needed. You can customize sequences later.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. No lock-in. During beta there's nothing to cancel. After launch, you can downgrade or pause your subscription at any time.",
  },
] as const;

export function FAQSection() {
  return (
    <section className="relative px-6 py-32 md:py-44">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <span className="font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-accent">
            FAQ
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-6 font-display text-4xl leading-[1.1] text-landing-text md:text-5xl">
            Common questions
          </h2>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group border border-landing-border bg-landing-surface/30 transition-colors hover:border-landing-border"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 px-6 font-body text-sm font-medium text-landing-text [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <ChevronDown className="size-4 shrink-0 text-landing-text-muted transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="border-t border-landing-border/50 px-6 py-4">
                  <p className="font-body text-sm leading-relaxed text-landing-text-secondary">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
