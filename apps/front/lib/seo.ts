/**
 * Constantes et helpers SEO pour Dunlo.
 */

export const SITE_URL = "https://dunlo.io" as const;

export const SEO_DEFAULTS = {
  siteName: "Dunlo",
  title: "Dunlo — Stop losing revenue to failed payments",
  description:
    "Dunlo connects to Stripe and automatically recovers failed payments, then escalates high-value accounts to you — in 10 minutes setup. Payment recovery for SaaS.",
  keywords: [
    "payment recovery",
    "failed payments",
    "saas",
    "stripe",
    "mrr",
    "churn",
    "revenue recovery",
    "subscription billing",
    "dunlo",
  ].join(", "),
  ogImage: `${SITE_URL}/og.png`,
  twitterHandle: "@dunlo",
  locale: "en_US",
} as const;

/** JSON-LD SoftwareApplication pour le référencement Google. */
export function getSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Dunlo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free during beta",
    },
    description: SEO_DEFAULTS.description,
    url: SITE_URL,
    slogan: "Stop losing revenue to failed payments",
    featureList: [
      "Real-time failed payment detection via Stripe",
      "Automated recovery email sequences",
      "Escalation alerts for high-value accounts",
      "Dashboard and analytics",
    ],
  };
}

export function getOpenGraphMeta({
  title,
  description,
  url,
  image,
  type = "website",
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
}) {
  return [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { property: "og:type", content: type },
    { property: "og:site_name", content: SEO_DEFAULTS.siteName },
    { property: "og:locale", content: SEO_DEFAULTS.locale },
    { property: "og:image", content: image ?? SEO_DEFAULTS.ogImage },
  ];
}

export function getTwitterMeta({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image?: string;
}) {
  return [
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SEO_DEFAULTS.twitterHandle },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image ?? SEO_DEFAULTS.ogImage },
  ];
}
