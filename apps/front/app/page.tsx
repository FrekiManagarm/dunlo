"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { FooterSection } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { PricingSection } from "@/components/landing/pricing";
import { ProblemSection } from "@/components/landing/problem";
import { SolutionSection } from "@/components/landing/solution";
import { cn } from "@/lib/utils";

function LandingNav() {
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

      <div className="flex items-center gap-8">
        <Link
          href="/blog"
          className="hidden text-sm text-landing-text-secondary transition-colors hover:text-landing-text md:block"
        >
          Blog
        </Link>
        <a
          href="#pricing"
          className="hidden text-sm text-landing-text-secondary transition-colors hover:text-landing-text md:block"
        >
          Pricing
        </a>
        <Link
          href="/register"
          className="group inline-flex items-center gap-2 bg-landing-accent px-5 py-2 text-sm font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,232,123,0.2)]"
        >
          Get started
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </nav>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      <LandingNav />

      <HeroSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <ProblemSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-accent/20 to-transparent" />
      </div>

      <SolutionSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <div id="pricing">
        <PricingSection />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FooterSection />
    </div>
  );
}
