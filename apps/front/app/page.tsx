"use client";

import { FAQSection } from "@/components/landing/faq";
import { FooterSection } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingSection } from "@/components/landing/pricing";
import { ProblemSection } from "@/components/landing/problem";
import { SolutionSection } from "@/components/landing/solution";
import { StatsBar } from "@/components/landing/stats-bar";

export default function LandingPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      <LandingNav />

      <HeroSection />

      <StatsBar />

      <ProblemSection />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="h-px bg-linear-to-r from-transparent via-landing-accent/15 to-transparent" />
      </div>

      <SolutionSection />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <PricingSection />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FAQSection />

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FooterSection />
    </div>
  );
}
