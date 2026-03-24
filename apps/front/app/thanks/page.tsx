import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CreditCard } from "lucide-react";

import { SEO_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Thank you — ${SEO_DEFAULTS.siteName}`,
  description:
    "Your payment details were saved. You can return to Dunlo to continue recovering failed payments.",
  robots: "noindex, nofollow",
};

export default function ThanksPage() {
  return (
    <div className="landing-grain landing-grid-bg relative flex min-h-svh flex-col overflow-hidden bg-landing-bg">
      <div className="landing-hero-glow pointer-events-none absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2" />

      <Link
        href="/"
        className="l-stagger absolute top-6 left-6 z-20 font-display text-xl text-landing-text transition-colors hover:text-landing-accent md:left-10 md:top-8"
        style={{ animationDelay: "80ms" }}
      >
        dunlo
      </Link>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg">
          <div
            className="l-stagger mb-8 flex justify-center"
            style={{ animationDelay: "140ms" }}
          >
            <div className="relative">
              <div
                className="absolute inset-0 animate-[l-glow-pulse_5s_ease-in-out_infinite] rounded-full bg-landing-accent/15 blur-2xl"
                aria-hidden
              />
              <div className="relative flex size-20 items-center justify-center rounded-full border border-landing-border bg-landing-surface/80 shadow-[0_0_0_1px_rgba(0,232,123,0.12)] backdrop-blur-md">
                <Check
                  className="size-9 text-landing-accent"
                  strokeWidth={2.25}
                  aria-hidden
                />
              </div>
            </div>
          </div>

          <div
            className="l-stagger mb-6 flex justify-center"
            style={{ animationDelay: "200ms" }}
          >
            <span className="inline-flex items-center gap-2 border border-landing-border bg-landing-surface/60 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-[0.2em] text-landing-text-secondary backdrop-blur-sm">
              <CreditCard className="size-3.5 text-landing-accent" aria-hidden />
              Billing updated
            </span>
          </div>

          <h1
            className="l-stagger text-center font-display text-[clamp(2rem,5vw,2.75rem)] leading-[1.1] tracking-[-0.03em] text-landing-text"
            style={{ animationDelay: "260ms" }}
          >
            Thank you — you&apos;re{" "}
            <span className="font-display italic text-landing-accent">
              all set.
            </span>
          </h1>

          <p
            className="l-stagger mt-6 text-center font-body text-base leading-relaxed text-landing-text-secondary md:text-lg"
            style={{ animationDelay: "340ms" }}
          >
            Your payment method was saved securely. Failed payment recovery
            keeps running in the background — you can pick up right where you
            left off.
          </p>

          <div
            className="l-stagger mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center"
            style={{ animationDelay: "420ms" }}
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 bg-landing-accent px-8 py-3.5 font-body text-sm font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,232,123,0.22)]"
            >
              Go to dashboard
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center justify-center border border-landing-border bg-landing-surface/50 px-8 py-3.5 font-body text-sm font-medium text-landing-text transition-colors hover:border-landing-accent/30 hover:text-landing-text"
            >
              Account settings
            </Link>
          </div>

          <div
            className="l-stagger mx-auto mt-14 h-px max-w-xs bg-linear-to-r from-transparent via-landing-border to-transparent"
            style={{ animationDelay: "500ms" }}
          />

          <p
            className="l-stagger mt-8 text-center font-body text-sm text-landing-text-muted"
            style={{ animationDelay: "560ms" }}
          >
            Questions about billing?{" "}
            <a
              href="mailto:support@dunlo.io"
              className="text-landing-accent transition-colors hover:underline"
            >
              support@dunlo.io
            </a>
          </p>
        </div>
      </main>

      <footer
        className="l-stagger relative z-10 pb-10 text-center"
        style={{ animationDelay: "620ms" }}
      >
        <Link
          href="/"
          className="font-body text-xs text-landing-text-muted transition-colors hover:text-landing-text-secondary"
        >
          ← Back to home
        </Link>
      </footer>
    </div>
  );
}
