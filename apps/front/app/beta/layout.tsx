import type { Metadata } from "next";

import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Join the beta — ${SEO_DEFAULTS.siteName}`,
  description:
    "Sign up for Dunlo beta. Payment recovery for SaaS — stop losing revenue to failed payments. Free during beta, no credit card required.",
  robots: "index, follow",
  alternates: { canonical: `${SITE_URL}/beta` },
  openGraph: {
    title: `Join the beta — ${SEO_DEFAULTS.siteName}`,
    description:
      "Sign up for Dunlo beta. Payment recovery for SaaS — stop losing revenue to failed payments. Free during beta, no credit card required.",
    url: `${SITE_URL}/beta`,
    type: "website",
  },
};

export default function BetaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
