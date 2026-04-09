"use client";

import { FAQSection } from "@/components/landing/faq";
import { FooterSection } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingSection } from "@/components/landing/pricing";
import { ProblemSection } from "@/components/landing/problem";
import { SolutionSection } from "@/components/landing/solution";
import { TestimonialsSection } from "@/components/landing/testimonials";

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

      <TestimonialsSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-accent/20 to-transparent" />
      </div>

      <div id="pricing">
        <PricingSection />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FAQSection />

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      <FooterSection />
    </div>
  );
}
