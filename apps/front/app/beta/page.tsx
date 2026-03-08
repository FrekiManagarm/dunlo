"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

import { BetaSignupForm } from "@/components/landing/beta-signup-form";
import { FooterSection } from "@/components/landing/footer";
import { cn } from "@/lib/utils";

function BetaNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-landing-border/50 bg-landing-bg/80 px-6 py-4 font-body backdrop-blur-xl transition-all duration-500 md:px-10",
        scrolled && "py-3",
      )}
    >
      <Link href="/" className="font-display text-2xl text-landing-text">
        dunlo
      </Link>

      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
    </nav>
  );
}

export default function BetaPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      <BetaNav />

      <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-32">
        <div className="landing-hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 mx-auto w-full max-w-md">
          <div
            className="l-stagger mb-8 text-center"
            style={{ animationDelay: "0ms" }}
          >
            <span className="inline-flex items-center gap-2 border border-landing-accent/20 bg-landing-accent/5 px-4 py-1.5 font-body text-xs font-medium uppercase tracking-widest text-landing-accent">
              Beta access
            </span>
          </div>

          <h1
            className="l-stagger text-center font-display text-3xl leading-tight text-landing-text sm:text-4xl"
            style={{ animationDelay: "100ms" }}
          >
            Join the beta.
            <br />
            <span className="italic text-landing-accent">
              We&apos;ll notify you.
            </span>
          </h1>

          <p
            className="l-stagger mt-4 text-center font-body text-sm text-landing-text-secondary"
            style={{ animationDelay: "150ms" }}
          >
            Free during beta. No credit card. ~10 min setup.
          </p>

          <div
            className="l-stagger mt-10"
            style={{ animationDelay: "250ms" }}
          >
            <BetaSignupForm />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FooterSection />
    </div>
  );
}
