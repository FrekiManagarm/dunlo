import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-32">
      <div className="landing-hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <div
          className="l-stagger mb-8 inline-flex items-center gap-2 border border-landing-border bg-landing-surface/60 px-4 py-1.5 font-medium uppercase tracking-[0.2em] text-landing-text-secondary backdrop-blur-sm"
          style={{ animationDelay: "100ms" }}
        >
          <span className="inline-block size-1.5 rounded-full bg-landing-accent" />
          Payment recovery for SaaS
        </div>

        <h1
          className="l-stagger landing-headline font-display text-landing-text"
          style={{ animationDelay: "250ms" }}
        >
          Stop losing revenue
          <br />
          to failed{" "}
          <span className="font-display italic text-landing-accent">
            payments.
          </span>
        </h1>

        <p
          className="l-stagger mt-8 max-w-2xl font-body text-lg leading-relaxed text-landing-text-secondary md:text-xl"
          style={{ animationDelay: "400ms" }}
        >
          Dunlo connects to Stripe and automatically recovers failed payments,
          then escalates high-value accounts to you — in 10 minutes setup.
        </p>

        <div
          className="l-stagger mt-12 flex flex-col items-center gap-4"
          style={{ animationDelay: "550ms" }}
        >
          <Link
            href="/register"
            className="group relative inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,232,123,0.25)]"
          >
            Join the beta — it&apos;s free to start
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <p className="font-body text-sm text-landing-text-muted">
            10 minute setup. Cancel anytime. No credit card required.
          </p>
        </div>
      </div>

      <div
        className="l-stagger absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animationDelay: "900ms" }}
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
