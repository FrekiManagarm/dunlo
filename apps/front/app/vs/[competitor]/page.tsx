import type { Metadata } from "next";
import Link from "next/link";
import { Check, X, ArrowRight, Minus } from "lucide-react";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing/landing-nav";
import { FooterSection } from "@/components/landing/footer";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/seo";

type CellValue = boolean | "partial" | string;

type Competitor = {
  name: string;
  tagline: string;
  description: string;
  comparisonRows: Array<{
    feature: string;
    dunlo: CellValue;
    competitor: CellValue;
  }>;
  dunloAdvantages: Array<{ title: string; description: string }>;
};

const COMPETITORS: Record<string, Competitor> = {
  "baremetrics-recover": {
    name: "Baremetrics Recover",
    tagline:
      "Baremetrics is great for analytics. Dunlo is built for recovery — and knows when to involve you personally.",
    description:
      "Baremetrics Recover is a solid option if you already pay for Baremetrics analytics. But if you just want to recover failed payments — without paying for a full analytics suite — Dunlo is purpose-built for that.",
    comparisonRows: [
      {
        feature: "Failure-specific sequences",
        dunlo: true,
        competitor: false,
      },
      { feature: "Personal draft for escalation", dunlo: true, competitor: false },
      { feature: "One-click Gmail send", dunlo: true, competitor: false },
      {
        feature: "Priority scoring (critical/high/normal)",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Recovery insights by failure type",
        dunlo: true,
        competitor: false,
      },
      { feature: "Slack escalation with draft", dunlo: true, competitor: false },
      {
        feature: "MRR analytics dashboard",
        dunlo: false,
        competitor: true,
      },
      {
        feature: "Fixed pricing (no % of MRR)",
        dunlo: "From €49/mo",
        competitor: "~$499+/mo",
      },
      { feature: "Setup time", dunlo: "5 minutes", competitor: "~15 minutes" },
    ],
    dunloAdvantages: [
      {
        title: "Built for recovery, not analytics",
        description:
          "Dunlo is focused entirely on recovering failed payments. You don't pay for features you don't need.",
      },
      {
        title: "Personal escalation engine",
        description:
          "When automation fails, Dunlo drafts a personal message for you — ready to send from your Gmail in one click. Baremetrics doesn't do this.",
      },
      {
        title: "Fixed, transparent pricing",
        description:
          "€49/mo flat. No percentage of recovered revenue, no surprise invoices based on MRR.",
      },
    ],
  },
  "churn-buster": {
    name: "Churn Buster",
    tagline:
      "Churn Buster is built for mid-market teams. Dunlo is built for founders who know their customers personally.",
    description:
      "Churn Buster is a powerful platform with great dunning features. But it starts at $249/mo and is designed for teams with a dedicated success function. Dunlo starts at €49/mo and is designed for a founder managing everything alone.",
    comparisonRows: [
      {
        feature: "Failure-specific sequences",
        dunlo: true,
        competitor: "partial",
      },
      { feature: "Personal draft for escalation", dunlo: true, competitor: false },
      { feature: "One-click Gmail send", dunlo: true, competitor: false },
      {
        feature: "Priority scoring",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Recovery insights by failure type",
        dunlo: true,
        competitor: false,
      },
      { feature: "Slack escalation with draft", dunlo: true, competitor: false },
      {
        feature: "Cancellation flow management",
        dunlo: false,
        competitor: true,
      },
      {
        feature: "Pricing",
        dunlo: "From €49/mo",
        competitor: "From $249/mo",
      },
      {
        feature: "Built for solo founders",
        dunlo: true,
        competitor: false,
      },
    ],
    dunloAdvantages: [
      {
        title: "Founder-grade escalation",
        description:
          "When a high-value account doesn't respond, Dunlo prepares a personal message you can send in one click. Churn Buster keeps you out of the loop.",
      },
      {
        title: "5× cheaper at entry",
        description:
          "Churn Buster starts at $249/mo. Dunlo starts at €49/mo. For a founder at €5k–€20k MRR, that's the difference between a tool that pays for itself and one that doesn't.",
      },
      {
        title: "Designed for your scale",
        description:
          "You know your customers personally. Dunlo is built around that — it helps you leverage that relationship, not replace it.",
      },
    ],
  },
  "stripe-smart-retries": {
    name: "Stripe Smart Retries",
    tagline:
      "Stripe Smart Retries is already running. Here's what it doesn't do — and what that costs you.",
    description:
      "Stripe Smart Retries is a good baseline. But it only handles the retry logic. It doesn't send emails, doesn't escalate high-value accounts, and doesn't give you any visibility into what's happening. Dunlo runs on top of it.",
    comparisonRows: [
      { feature: "Automatic payment retries", dunlo: true, competitor: true },
      {
        feature: "Failure-specific email sequences",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Personal draft for escalation",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Dashboard visibility",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Recovery insights",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Founder escalation with Gmail send",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Branded card update page",
        dunlo: true,
        competitor: false,
      },
      { feature: "Morning brief digest", dunlo: true, competitor: false },
      {
        feature: "Pricing",
        dunlo: "From €49/mo",
        competitor: "Included in Stripe",
      },
    ],
    dunloAdvantages: [
      {
        title: "Dunlo runs on top of Stripe Smart Retries",
        description:
          "Not instead of it. Smart Retries handles the technical retry. Dunlo handles everything else: emails, escalation, visibility, insights.",
      },
      {
        title: "Email sequences by failure type",
        description:
          "Expired card, insufficient funds, compromised card — each gets a different email. Stripe sends nothing.",
      },
      {
        title: "You know when something is happening",
        description:
          "Right now, if a payment fails silently, you won't know for days. Dunlo notifies you in real time with full context.",
      },
    ],
  },
  stunning: {
    name: "Stunning",
    tagline:
      "Stunning is battle-tested and has recovered $10B+ in revenue. Dunlo is what comes after — for founders who want more than automation.",
    description:
      "Stunning has been around since 2012 and is a proven dunning tool. If you want something mature and well-tested, it's a solid choice. If you want founder-grade escalation, personal draft generation, and failure-type intelligence — that's Dunlo.",
    comparisonRows: [
      { feature: "Email dunning sequences", dunlo: true, competitor: true },
      {
        feature: "Failure-specific sequences",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Personal draft for escalation",
        dunlo: true,
        competitor: false,
      },
      { feature: "One-click Gmail send", dunlo: true, competitor: false },
      {
        feature: "Priority scoring (critical/high/normal)",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Recovery insights by failure type",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Slack escalation with draft",
        dunlo: true,
        competitor: false,
      },
      {
        feature: "Track record / years in market",
        dunlo: "Beta 2026",
        competitor: "Since 2012",
      },
      {
        feature: "Pricing model",
        dunlo: "Fixed (€49–€399/mo)",
        competitor: "Based on MRR (variable)",
      },
    ],
    dunloAdvantages: [
      {
        title: "Personal escalation — Stunning doesn't have it",
        description:
          "When automation fails for a high-value account, Dunlo drafts a personal message tailored to the customer — ready to send from your Gmail. Stunning is zero-touch only.",
      },
      {
        title: "Fixed, predictable pricing",
        description:
          "Stunning's pricing scales with your MRR. Dunlo is €49/mo flat at entry — you always know what you pay.",
      },
      {
        title: "Failure-type intelligence",
        description:
          "Dunlo sends different emails for expired cards vs. insufficient funds vs. compromised cards. Stunning uses generic sequences.",
      },
    ],
  },
};

type Props = {
  params: Promise<{ competitor: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params;
  const data = COMPETITORS[competitor];
  if (!data) return {};

  return {
    title: `Dunlo vs ${data.name} — Payment Recovery Comparison`,
    description: `Compare Dunlo and ${data.name} for failed payment recovery. See which tool recovers more revenue for bootstrapped SaaS founders.`,
    alternates: { canonical: `${SITE_URL}/vs/${competitor}` },
    openGraph: {
      title: `Dunlo vs ${data.name} — Payment Recovery Comparison`,
      description: `Compare Dunlo and ${data.name} for failed payment recovery. See which tool recovers more revenue for bootstrapped SaaS founders.`,
      url: `${SITE_URL}/vs/${competitor}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Dunlo vs ${data.name} — Payment Recovery Comparison`,
      description: `Compare Dunlo and ${data.name} for failed payment recovery.`,
    },
  };
}

export function generateStaticParams() {
  return Object.keys(COMPETITORS).map((slug) => ({ competitor: slug }));
}

function CellIcon({ value }: { value: CellValue }) {
  if (value === true)
    return <Check className="mx-auto size-4 text-emerald-400" />;
  if (value === false)
    return <X className="mx-auto size-4 text-muted-foreground/40" />;
  if (value === "partial")
    return <Minus className="mx-auto size-4 text-amber-400/70" />;
  return (
    <span className="block text-center text-xs text-muted-foreground">
      {value}
    </span>
  );
}

export default async function VsPage({ params }: Props) {
  const { competitor } = await params;
  const data = COMPETITORS[competitor];

  if (!data) notFound();

  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      <LandingNav />

      {/* Hero */}
      <section className="px-6 pb-20 pt-40 md:pt-52">
        <div className="mx-auto max-w-4xl">
          <span className="mb-6 inline-block font-body text-xs font-medium uppercase tracking-[0.25em] text-landing-text-muted">
            Dunlo vs {data.name}
          </span>
          <h1 className="font-display text-4xl leading-[1.1] text-landing-text md:text-6xl lg:text-7xl">
            {data.tagline}
          </h1>
          <p className="mt-8 max-w-2xl font-body text-lg leading-relaxed text-landing-text-secondary">
            {data.description}
          </p>
          <Link
            href="/beta"
            className="group mt-10 inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,232,123,0.25)]"
          >
            Try Dunlo free — 5 min setup
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      {/* Comparison table */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 font-display text-3xl text-landing-text md:text-4xl">
            Feature comparison
          </h2>

          <div className="overflow-hidden border border-landing-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-landing-border">
                  <th className="py-4 pl-6 pr-4 text-left font-medium text-landing-text-muted">
                    Feature
                  </th>
                  <th className="w-36 px-4 py-4 text-center font-bold text-landing-accent">
                    Dunlo
                    <span className="ml-1.5 inline-block border border-landing-accent/30 bg-landing-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      You
                    </span>
                  </th>
                  <th className="w-36 px-4 py-4 text-center font-medium text-landing-text-muted">
                    {data.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={
                      i % 2 === 0
                        ? "bg-landing-surface/10"
                        : "bg-landing-surface/30"
                    }
                  >
                    <td className="py-3.5 pl-6 pr-4 text-landing-text-secondary">
                      {row.feature}
                    </td>
                    <td className="px-4 py-3.5">
                      <CellIcon value={row.dunlo} />
                    </td>
                    <td className="px-4 py-3.5">
                      <CellIcon value={row.competitor} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-accent/20 to-transparent" />
      </div>

      {/* Why Dunlo */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 font-display text-3xl text-landing-text md:text-4xl">
            Why founders choose Dunlo
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {data.dunloAdvantages.map((adv) => (
              <div
                key={adv.title}
                className="border border-landing-border bg-landing-surface/30 p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-block size-1.5 rounded-full bg-landing-accent" />
                  <h3 className="font-display text-lg text-landing-text">
                    {adv.title}
                  </h3>
                </div>
                <p className="font-body text-sm leading-relaxed text-landing-text-secondary">
                  {adv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="h-px bg-linear-to-r from-transparent via-landing-border to-transparent" />
      </div>

      {/* CTA */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-3xl text-landing-text md:text-4xl">
            Stop losing revenue. Start recovering it.
          </h2>
          <p className="mt-4 font-body text-lg text-landing-text-secondary">
            Free during beta. 5 minute setup. No credit card required.
          </p>
          <Link
            href="/beta"
            className="group mt-10 inline-flex items-center gap-3 bg-landing-accent px-8 py-4 font-body text-base font-semibold text-landing-bg transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,232,123,0.25)]"
          >
            Join the beta — it&apos;s free
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <FooterSection />
    </div>
  );
}
