import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — Dunlo",
  description:
    "Terms of service for Dunlo, the failed payment recovery solution for SaaS founders.",
  robots: "noindex",
};

const SECTIONS = [
  { id: "purpose", label: "1. Purpose" },
  { id: "definitions", label: "2. Definitions" },
  { id: "access", label: "3. Access to the Service" },
  { id: "account", label: "4. User Account" },
  { id: "services", label: "5. Services Provided" },
  { id: "pricing", label: "6. Pricing and Billing" },
  { id: "data", label: "7. Personal Data" },
  { id: "ip", label: "8. Intellectual Property" },
  { id: "liability", label: "9. Limitation of Liability" },
  { id: "termination", label: "10. Termination" },
  { id: "law", label: "11. Governing Law" },
];

export default function CGUPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      {/* Nav */}
      <nav className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-landing-border/50 bg-landing-bg/80 px-6 py-4 font-body backdrop-blur-xl md:px-10">
        <Link href="/" className="font-display text-2xl text-landing-text">
          dunlo
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pb-32 pt-32 md:px-10">
        {/* Header */}
        <div className="mb-16 border-b border-landing-border pb-12">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.2em] text-landing-accent">
            Legal
          </p>
          <h1 className="font-display text-4xl leading-tight text-landing-text md:text-5xl lg:text-6xl">
            Terms of
            <br />
            <span className="italic text-landing-text-secondary">Service</span>
          </h1>
          <div className="mt-6 flex flex-wrap gap-8 font-body text-sm text-landing-text-muted">
            <span>
              Effective date:{" "}
              <span className="text-landing-text-secondary">April 1, 2026</span>
            </span>
            <span>
              Last updated:{" "}
              <span className="text-landing-text-secondary">April 1, 2026</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Sidebar TOC */}
          <aside className="shrink-0 lg:w-56">
            <div className="sticky top-28">
              <p className="mb-4 font-body text-xs uppercase tracking-[0.15em] text-landing-text-muted">
                Contents
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-center gap-2.5 rounded-none py-1.5 font-body text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
                  >
                    <span className="h-px w-3 bg-landing-border transition-all duration-200 group-hover:w-5 group-hover:bg-landing-accent" />
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="min-w-0 flex-1 font-body text-base leading-relaxed text-landing-text-secondary">
            {/* Section 1 */}
            <Section id="purpose" title="1. Purpose">
              <p>
                These terms of service (the "Terms") govern access to and use of the Dunlo
                platform (the "Service"), operated by{" "}
                <strong className="text-landing-text">Dunlo SAS</strong>, a simplified
                joint-stock company registered with the Paris Commercial Registry (RCS de
                Paris), headquartered in France ("Dunlo", "we").
              </p>
              <p className="mt-4">
                By accessing the Service or creating an account, you unconditionally accept
                these Terms. If you do not accept these Terms, you must immediately stop
                using the Service.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="definitions" title="2. Definitions">
              <DefinitionList
                items={[
                  {
                    term: "Service",
                    def: "The Dunlo platform accessible at dunlo.io, enabling automated recovery of failed Stripe payments.",
                  },
                  {
                    term: "User",
                    def: "Any individual or legal entity that accesses the Service and creates an account.",
                  },
                  {
                    term: "Connect Account",
                    def: "The User's Stripe account connected to Dunlo via Stripe Connect OAuth.",
                  },
                  {
                    term: "Failed Payment",
                    def: 'Any Stripe PaymentIntent or Invoice with a status of "failed" or "past_due".',
                  },
                  {
                    term: "Email Sequence",
                    def: "The set of automated emails sent by Dunlo to a User's end buyer to recover a failed payment.",
                  },
                  {
                    term: "Escalation",
                    def: "The alert sent to the User when a failed payment exceeds the threshold defined in their settings.",
                  },
                ]}
              />
            </Section>

            {/* Section 3 */}
            <Section id="access" title="3. Access to the Service">
              <p>
                The Service is accessible to any person with an active Stripe account and an
                internet connection. Access requires creating a Dunlo account and connecting
                at least one Stripe account via Stripe Connect.
              </p>
              <p className="mt-4">
                Dunlo reserves the right to suspend or restrict access to the Service without
                notice in the event of a breach of these Terms, fraudulent behavior, or for
                technical maintenance reasons.
              </p>
              <p className="mt-4">
                The User is responsible for the security of their login credentials and must
                immediately report any unauthorized use of their account to{" "}
                <a
                  href="mailto:support@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  support@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 4 */}
            <Section id="account" title="4. User Account">
              <p>
                To use the Service, the User must create an account by providing a valid
                email address and setting a secure password, or by authenticating via a
                third-party identity provider (Google).
              </p>
              <p className="mt-4">
                The User agrees to provide accurate information and keep it up to date.
                Inaccurate or incomplete information may result in account suspension. Only
                one account is permitted per legal entity.
              </p>
              <p className="mt-4">
                By connecting their Stripe account, the User authorizes Dunlo to read
                payment data, create webhook endpoints on their Stripe account, and interact
                with the Stripe API strictly within the scope of the Service. These
                permissions can be revoked at any time from the User's Stripe dashboard.
              </p>
            </Section>

            {/* Section 5 */}
            <Section id="services" title="5. Services Provided">
              <p>Dunlo offers the following features, depending on the subscribed plan:</p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Real-time detection of failed Stripe payments via webhooks",
                  "Automated sending of recovery email sequences to end buyers",
                  "Generation of personalized Stripe Billing Portal links for payment method updates",
                  "Escalation system with email and/or Slack alerts for high-value accounts",
                  "Daily morning brief summarizing recovery activity",
                  "Dashboard to track failed and recovered payments",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                Dunlo is not a party to transactions between the User and their end buyers.
                The Service is limited to sending communications and providing tracking tools.
                Dunlo does not store card data and does not initiate any charges.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="pricing" title="6. Pricing and Billing">
              <p>
                Access to the Service is subject to a monthly subscription, with pricing
                available on the{" "}
                <Link
                  href="/#pricing"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  Pricing
                </Link>{" "}
                page. Prices are listed in euros, exclusive of taxes.
              </p>
              <p className="mt-4">
                Billing is managed by our billing partner Autumn. The first charge occurs at
                the end of the free trial period, if applicable. Subscriptions renew
                automatically each month unless cancelled before the renewal date.
              </p>
              <p className="mt-4">
                In the event of a failed payment for a Dunlo subscription, the Service will
                be suspended after a 7-day grace period. The User will be notified by email.
                Dunlo reserves the right to modify its pricing by giving the User 30 days'
                advance notice.
              </p>
              <Callout>
                During the beta period, the Growth plan is available free of charge. Final
                pricing terms will be communicated before the end of the beta period.
              </Callout>
            </Section>

            {/* Section 7 */}
            <Section id="data" title="7. Personal Data Protection">
              <p>
                In the course of providing the Service, Dunlo processes personal data in two
                categories:
              </p>
              <p className="mt-4">
                <strong className="text-landing-text">User data:</strong> email, name,
                notification preferences, escalation threshold. This data is necessary for
                providing the Service and retained for the duration of the contractual
                relationship, then 3 years for accounting purposes.
              </p>
              <p className="mt-4">
                <strong className="text-landing-text">End buyer data:</strong> email, name,
                transaction amount. This data comes from the User's Stripe account. The User
                is the data controller under GDPR for this data; Dunlo acts as a data
                processor.
              </p>
              <p className="mt-4">
                Stripe access tokens are encrypted at rest (AES-256). Payment data is
                transmitted over TLS connections. Dunlo does not sell or rent any data to
                third parties. To exercise your rights (access, rectification, deletion),
                contact{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 8 */}
            <Section id="ip" title="8. Intellectual Property">
              <p>
                All elements of the Service (source code, interfaces, algorithms, trademarks,
                logos, content) are the exclusive property of Dunlo or its licensors. Any
                reproduction, modification, distribution, or exploitation, even partial,
                without prior written authorization from Dunlo, is strictly prohibited.
              </p>
              <p className="mt-4">
                The User retains ownership of their data. By using the Service, they grant
                Dunlo a limited, non-exclusive license to process this data strictly in the
                context of providing the Service.
              </p>
              <p className="mt-4">
                Using the Service does not grant the User any intellectual property rights
                over the Service or its components.
              </p>
            </Section>

            {/* Section 9 */}
            <Section id="liability" title="9. Limitation of Liability">
              <p>
                The Service is provided "as is". Dunlo commits to maintaining availability
                above 99.5% on a monthly basis, excluding scheduled maintenance communicated
                in advance.
              </p>
              <p className="mt-4">
                Dunlo cannot be held liable for revenue losses resulting from:
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  "Stripe API outages beyond Dunlo's control",
                  "Recovery emails marked as spam by recipient mail servers",
                  "End buyers choosing not to update their payment method",
                  "Non-compliant use of the Service by the User",
                  "Force majeure events",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-border-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                Dunlo's total liability, for any reason, is capped at the amounts actually
                paid by the User in the 3 months preceding the event that caused the damage.
              </p>
            </Section>

            {/* Section 10 */}
            <Section id="termination" title="10. Termination">
              <p>
                The User may cancel their subscription at any time from their account.
                Cancellation takes effect at the end of the current billing period. No
                prorated refunds are provided.
              </p>
              <p className="mt-4">
                Dunlo may terminate or suspend a User's account without notice in the event
                of: breach of these Terms, abusive behavior, prolonged non-payment, or
                detected fraudulent activity.
              </p>
              <p className="mt-4">
                Following termination, the User's data is retained for 30 days and then
                permanently deleted, unless legally required otherwise. The User may request
                a data export before deletion.
              </p>
            </Section>

            {/* Section 11 */}
            <Section id="law" title="11. Governing Law and Disputes">
              <p>
                These Terms are governed by French law. In the event of a dispute regarding
                their interpretation or performance, the parties agree to seek an amicable
                resolution before pursuing legal action.
              </p>
              <p className="mt-4">
                Failing an amicable agreement within 30 days of notification of the dispute
                by either party, the courts of Paris will have exclusive jurisdiction.
              </p>
              <p className="mt-4">
                If any clause of these Terms is declared void or unenforceable, the remaining
                clauses remain in force.
              </p>
              <p className="mt-6 border-t border-landing-border pt-6 text-sm text-landing-text-muted">
                For any question regarding these Terms:{" "}
                <a
                  href="mailto:legal@dunlo.io"
                  className="text-landing-text-secondary underline underline-offset-2 transition-colors hover:text-landing-text"
                >
                  legal@dunlo.io
                </a>
              </p>
            </Section>
          </article>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-landing-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 md:flex-row md:justify-between md:px-10">
          <Link href="/" className="font-display text-xl text-landing-text">
            dunlo
          </Link>
          <span className="font-body text-xs text-landing-text-muted">
            © {new Date().getFullYear()} Dunlo. All rights reserved.
          </span>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <h2 className="mb-5 font-display text-xl text-landing-text md:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DefinitionList({
  items,
}: {
  items: { term: string; def: string }[];
}) {
  return (
    <dl className="flex flex-col gap-4">
      {items.map(({ term, def }) => (
        <div key={term} className="flex flex-col gap-1 border-l border-landing-border pl-4">
          <dt className="font-body text-sm font-semibold text-landing-text">{term}</dt>
          <dd className="font-body text-sm text-landing-text-secondary">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 border-l-2 border-landing-accent bg-landing-accent/5 px-5 py-4">
      <p className="font-body text-sm text-landing-text-secondary">{children}</p>
    </div>
  );
}
