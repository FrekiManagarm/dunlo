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

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Dunlo work with Stripe Connect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Dunlo connects to both standard Stripe accounts and Stripe Connect platforms. We read your payment intents and customer data to detect failed payments and trigger recovery flows.",
      },
    },
    {
      "@type": "Question",
      name: "What happens after the beta?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "During beta, every plan is free. When we launch, you'll pick the tier that fits (Solo €19/mo, Starter €49/mo, Growth €149/mo, or Scale €399/mo). We'll give you a heads-up before any billing starts.",
      },
    },
    {
      "@type": "Question",
      name: "Will my recovery emails go to spam?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Dunlo sends from your domain via your own email provider. You control deliverability. We avoid spam-trigger words and our templates are written for high inbox placement.",
      },
    },
    {
      "@type": "Question",
      name: "How long does setup take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "About 5 minutes: connect Stripe, add your email provider, review the default sequences. No code, no engineering team needed.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. No lock-in. During beta there's nothing to cancel. After launch, you can downgrade or pause at any time.",
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />
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
