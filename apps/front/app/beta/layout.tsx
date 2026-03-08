import type { Metadata } from "next";

import { SEO_DEFAULTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Join the beta — ${SEO_DEFAULTS.siteName}`,
  description:
    "Sign up for Dunlo beta. Payment recovery for SaaS — stop losing revenue to failed payments. Free during beta, no credit card required.",
  robots: "index, follow",
};

export default function BetaLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
