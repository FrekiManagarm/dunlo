import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DunloLogo } from "@/components/dunlo-logo";

const stats = [
  { value: "€800", label: "avg. monthly revenue lost to failed payments" },
  { value: "10 min", label: "to connect Stripe and go live" },
  { value: "3 emails", label: "per failure type, sent automatically" },
] as const;

export function BlogArticleCTA() {
  return (
    <aside
      className="l-stagger mt-20 border-t border-landing-border pt-14"
      aria-label="Dunlo — recover your failed payments"
    >
      <p className="mb-8 font-body text-[11px] uppercase tracking-[0.2em] text-landing-text-muted">
        Written by the Dunlo team
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px]">
        {/* Left — pitch */}
        <div>
          <h2 className="font-display text-3xl leading-[1.08] text-landing-text md:text-4xl">
            You just read about failed payments.
            <br />
            <span className="italic text-landing-accent">
              Now stop losing money to them.
            </span>
          </h2>
          <p className="mt-5 max-w-[52ch] font-body text-base leading-relaxed text-landing-text-secondary">
            Dunlo watches your Stripe account around the clock, fires recovery
            emails the moment a payment fails, and surfaces high-value accounts
            that need a founder's personal touch — all without a dedicated team.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/beta"
              className="group inline-flex w-fit items-center gap-3 bg-landing-accent px-7 py-3.5 font-body text-sm font-semibold text-landing-bg transition-all duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] active:scale-[0.98]"
            >
              Start recovering revenue
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <p className="font-body text-xs text-landing-text-muted">
              Free during beta · No credit card · Cancel anytime
            </p>
          </div>
        </div>

        {/* Right — stats */}
        <div className="divide-y divide-landing-border border border-landing-border bg-landing-surface/30 px-6 py-5">
          {stats.map((stat) => (
            <div key={stat.label} className="py-5 first:pt-0 last:pb-0">
              <span className="font-display text-2xl text-landing-accent">
                {stat.value}
              </span>
              <p className="mt-1 font-body text-xs leading-snug text-landing-text-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 flex flex-col gap-4 border-t border-landing-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <DunloLogo
          sizeClassName="text-base"
          wordmarkClassName="text-landing-text-muted"
        />
        <Link
          href="/blog"
          className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
        >
          ← Back to all articles
        </Link>
      </div>
    </aside>
  );
}
