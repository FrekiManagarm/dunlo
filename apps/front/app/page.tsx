import type { Metadata } from "next";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

import { FAQSection } from "@/components/landing/faq";
import { FooterSection } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero";
import { LandingNav } from "@/components/landing/landing-nav";
import { PricingSection } from "@/components/landing/pricing";
import { ProblemSection } from "@/components/landing/problem";
import { SolutionSection } from "@/components/landing/solution";
import { StatsBar } from "@/components/landing/stats-bar";

export const metadata: Metadata = {
  title: SEO_DEFAULTS.title,
  description: SEO_DEFAULTS.description,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    url: SITE_URL,
    type: "website",
    siteName: SEO_DEFAULTS.siteName,
    locale: SEO_DEFAULTS.locale,
    images: [
      {
        url: SEO_DEFAULTS.ogImage,
        width: 1200,
        height: 630,
        alt: SEO_DEFAULTS.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEO_DEFAULTS.title,
    description: SEO_DEFAULTS.description,
    creator: SEO_DEFAULTS.twitterHandle,
    images: [SEO_DEFAULTS.ogImage],
  },
};

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
