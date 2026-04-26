import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroDashboard } from "./hero-dashboard";

export function HeroSection() {
  return (
    <section className="relative min-h-dvh overflow-hidden px-6 pb-20 pt-32 md:px-10 lg:pt-40">
      <div
        className="landing-hero-glow pointer-events-none absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/3"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_500px]">
          {/* Left: Headline + CTA */}
          <div>
            <div
              className="l-stagger mb-10 inline-flex items-center gap-2.5 border border-landing-border bg-landing-surface/60 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-landing-accent backdrop-blur-sm"
              style={{ animationDelay: "80ms" }}
            >
              <span className="size-1.5 animate-pulse rounded-full bg-landing-accent" />
              Beta — free to start
            </div>

            <h1
              className="l-stagger landing-headline font-display text-landing-text"
              style={{ animationDelay: "180ms" }}
            >
              Stop losing revenue
              <br />
              to failed payments.
              <br />
              <span className="italic text-landing-accent">Automatically.</span>
            </h1>

            <p
              className="l-stagger mt-8 max-w-xl font-body text-lg leading-relaxed text-landing-text-secondary"
              style={{ animationDelay: "340ms" }}
            >
              Dunlo connects to Stripe, detects every failed payment by type,
              sends the right recovery email — and escalates high-value accounts
              directly to you. Setup in 5 minutes.
            </p>

            <div
              className="l-stagger mt-12 flex flex-wrap items-center gap-5"
              style={{ animationDelay: "460ms" }}
            >
              <Link
                href="/beta"
                className="group relative inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] active:scale-[0.98]"
              >
                Join the beta — free
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <a
                href="#pricing"
                className="font-body text-sm text-landing-text-muted underline-offset-4 transition-colors hover:text-landing-text-secondary hover:underline"
              >
                See pricing
              </a>
            </div>

            <p
              className="l-stagger mt-5 font-body text-xs text-landing-text-muted"
              style={{ animationDelay: "520ms" }}
            >
              No credit card required · Cancel anytime · 5 min setup
            </p>
          </div>

          {/* Right: Dashboard mockup */}
          <div className="l-stagger" style={{ animationDelay: "620ms" }}>
            <HeroDashboard />
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="l-stagger absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:flex"
        style={{ animationDelay: "1100ms" }}
      >
        <div className="flex flex-col items-center gap-2 text-landing-text-muted">
          <span className="font-body text-xs uppercase tracking-widest">
            Scroll
          </span>
          <div className="h-8 w-px bg-linear-to-b from-landing-text-muted/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
