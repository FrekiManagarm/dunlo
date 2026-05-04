import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Dunlo",
  description:
    "Privacy policy for Dunlo: how we collect, use, and protect your personal data.",
  robots: "noindex",
};

const SECTIONS = [
  { id: "introduction", label: "1. Introduction" },
  { id: "controller", label: "2. Data Controller" },
  { id: "data-collected", label: "3. Data Collected" },
  { id: "purposes", label: "4. Purposes & Legal Bases" },
  { id: "sub-processors", label: "5. Sub-processors & Sharing" },
  { id: "retention", label: "6. Retention Periods" },
  { id: "rights", label: "7. Your GDPR Rights" },
  { id: "security", label: "8. Security" },
  { id: "cookies", label: "9. Cookies" },
  { id: "transfers", label: "10. International Transfers" },
  { id: "changes", label: "11. Policy Changes" },
  { id: "contact", label: "12. Contact" },
];

export default function PrivacyPage() {
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
            Privacy
            <br />
            <span className="italic text-landing-text-secondary">Policy</span>
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
            <Section id="introduction" title="1. Introduction">
              <p>
                This privacy policy describes how{" "}
                <strong className="text-landing-text">Dunlo SAS</strong> ("Dunlo", "we")
                collects, uses, and protects the personal data of users of the dunlo.io
                platform (the "Service").
              </p>
              <p className="mt-4">
                Dunlo is committed to complying with the General Data Protection Regulation
                (GDPR — Regulation (EU) 2016/679) and applicable French data protection law.
                By using the Service, you accept the practices described in this policy.
              </p>
              <p className="mt-4">
                This policy applies to the personal data of founders and teams who use Dunlo
                ("Users"), as well as the data of end buyers ("End Buyers") processed by
                Dunlo on behalf of Users.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="controller" title="2. Data Controller">
              <DefinitionList
                items={[
                  {
                    term: "Entity",
                    def: "Dunlo SAS, a simplified joint-stock company registered with the Paris Commercial Registry (RCS de Paris).",
                  },
                  {
                    term: "Address",
                    def: "France (full address available on request at legal@dunlo.io).",
                  },
                  {
                    term: "DPO Contact",
                    def: "privacy@dunlo.io — for any question regarding the processing of your data.",
                  },
                ]}
              />
              <p className="mt-6">
                For End Buyer data (the User's customers), the User is the data controller
                under GDPR. Dunlo acts as a data processor and processes this data solely
                according to the User's instructions and strictly within the scope of the
                Service.
              </p>
            </Section>

            {/* Section 3 */}
            <Section id="data-collected" title="3. Data Collected">
              <p className="mb-5">
                Dunlo collects two distinct categories of personal data:
              </p>

              <p className="mb-3">
                <strong className="text-landing-text">A. User Data</strong>
              </p>
              <ul className="mb-6 flex flex-col gap-3">
                {[
                  "Identity: name, email address",
                  "Authentication: password hash or OAuth credentials (Google)",
                  "Preferences: timezone, escalation threshold, notification email, morning brief schedule",
                  "Integrations: Stripe Connect account ID, encrypted access token",
                  "Usage data: connection logs, actions performed in the dashboard",
                  "Billing: subscription history (managed by Autumn — we do not store card data)",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mb-3">
                <strong className="text-landing-text">B. End Buyer Data</strong>
              </p>
              <p className="mb-4">
                This data is transmitted via the User's Stripe API and is strictly limited to
                what is necessary for payment recovery:
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "End buyer's email and name",
                  "Failed payment amount and currency",
                  "Stripe failure code (e.g. card_expired, insufficient_funds)",
                  "Stripe identifiers: PaymentIntent ID, Customer ID (to generate the Billing Portal link)",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-border-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Callout>
                Dunlo never collects card data. Card numbers, CVV, and sensitive payment data
                remain exclusively with Stripe.
              </Callout>
            </Section>

            {/* Section 4 */}
            <Section id="purposes" title="4. Purposes & Legal Bases">
              <p className="mb-5">
                Each processing activity rests on an explicit legal basis under Article 6 of
                the GDPR:
              </p>
              <div className="flex flex-col gap-5">
                {[
                  {
                    purpose: "Service delivery",
                    basis: "Contract performance",
                    detail:
                      "Create and manage your account, connect your Stripe, detect failed payments and send recovery sequences.",
                  },
                  {
                    purpose: "Billing",
                    basis: "Contract performance + legal obligation",
                    detail:
                      "Manage your subscription, issue invoices, and comply with accounting obligations.",
                  },
                  {
                    purpose: "Notifications & alerts",
                    basis: "Contract performance",
                    detail:
                      "Send you escalation alerts, the morning brief, and notifications of your choice.",
                  },
                  {
                    purpose: "Service improvement",
                    basis: "Legitimate interest",
                    detail:
                      "Analyze aggregated and anonymized usage metrics to improve features.",
                  },
                  {
                    purpose: "Security & fraud prevention",
                    basis: "Legitimate interest",
                    detail:
                      "Detect unauthorized access, prevent fraud, and ensure Service integrity.",
                  },
                  {
                    purpose: "Marketing communications",
                    basis: "Consent",
                    detail:
                      "Send you emails about Dunlo updates. You can unsubscribe at any time.",
                  },
                ].map(({ purpose, basis, detail }) => (
                  <div key={purpose} className="border-l border-landing-border pl-4">
                    <p className="text-sm font-semibold text-landing-text">{purpose}</p>
                    <p className="mt-0.5 text-xs text-landing-accent">{basis}</p>
                    <p className="mt-1.5 text-sm text-landing-text-secondary">{detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 5 */}
            <Section id="sub-processors" title="5. Sub-processors & Data Sharing">
              <p className="mb-5">
                Dunlo uses sub-processors to provide the Service. These providers act solely
                on Dunlo's instructions and are contractually required to comply with GDPR:
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    name: "Neon (Database)",
                    region: "EU",
                    data: "All application data",
                  },
                  {
                    name: "Vercel (Hosting)",
                    region: "EU / USA (SCC)",
                    data: "Request logs, data in transit",
                  },
                  {
                    name: "Resend (Transactional emails)",
                    region: "USA (SCC)",
                    data: "End buyer email, recovery email content",
                  },
                  {
                    name: "Stripe (Payment & Connect)",
                    region: "USA (SCC)",
                    data: "Payment data, Customer ID, access token",
                  },
                  {
                    name: "Trigger.dev (Async jobs)",
                    region: "EU",
                    data: "Job parameters (email, amount)",
                  },
                  {
                    name: "Autumn (Billing)",
                    region: "USA (SCC)",
                    data: "User email and subscription history",
                  },
                ].map(({ name, region, data }) => (
                  <div
                    key={name}
                    className="grid grid-cols-1 gap-1 border-l border-landing-border pl-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-landing-text">{name}</p>
                      <p className="mt-0.5 text-sm text-landing-text-secondary">{data}</p>
                    </div>
                    <span className="self-start text-xs text-landing-text-muted">{region}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6">
                Dunlo never sells, rents, or monetizes your data or your End Buyers' data to
                third parties. No sharing for advertising purposes.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="retention" title="6. Retention Periods">
              <div className="flex flex-col gap-4">
                {[
                  {
                    category: "User account data",
                    period: "Duration of the contractual relationship + 3 years (accounting obligations)",
                  },
                  {
                    category: "End buyer data",
                    period: "12 months after payment resolution (recovered or lost), then automatic deletion",
                  },
                  {
                    category: "Security logs",
                    period: "Rolling 12 months",
                  },
                  {
                    category: "Billing data",
                    period: "10 years (legal accounting obligation)",
                  },
                  {
                    category: "After account termination",
                    period: "30-day retention then permanent deletion, unless export requested",
                  },
                ].map(({ category, period }) => (
                  <div key={category} className="flex flex-col gap-1 border-l border-landing-border pl-4">
                    <dt className="text-sm font-semibold text-landing-text">{category}</dt>
                    <dd className="text-sm text-landing-text-secondary">{period}</dd>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 7 */}
            <Section id="rights" title="7. Your GDPR Rights">
              <p className="mb-5">
                Under GDPR (Articles 15–22), you have the following rights over your personal
                data:
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    right: "Right of access",
                    desc: "Obtain a copy of the personal data we hold about you.",
                  },
                  {
                    right: "Right to rectification",
                    desc: "Correct inaccurate or incomplete data about you.",
                  },
                  {
                    right: "Right to erasure",
                    desc: "Request deletion of your data, subject to our legal obligations.",
                  },
                  {
                    right: "Right to portability",
                    desc: "Receive your data in a structured, machine-readable format.",
                  },
                  {
                    right: "Right to object",
                    desc: "Object to processing based on our legitimate interest, including for marketing purposes.",
                  },
                  {
                    right: "Right to restriction",
                    desc: "Request temporary suspension of processing during a dispute.",
                  },
                  {
                    right: "Withdrawal of consent",
                    desc: "Withdraw your consent at any time for processing that depends on it (e.g. marketing emails).",
                  },
                ].map(({ right, desc }) => (
                  <li key={right} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>
                      <strong className="text-landing-text">{right} — </strong>
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                To exercise these rights, send your request to{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>{" "}
                identifying yourself. We will respond within 30 days.
              </p>
              <p className="mt-4">
                If you believe your rights are not being respected, you may lodge a complaint
                with the{" "}
                <strong className="text-landing-text">CNIL</strong> (French Data Protection
                Authority): cnil.fr.
              </p>
            </Section>

            {/* Section 8 */}
            <Section id="security" title="8. Security">
              <p>
                Dunlo implements appropriate technical and organizational measures to protect
                your data against unauthorized access, loss, alteration, or disclosure:
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "AES-256 encryption of Stripe access tokens at rest",
                  "Data transmission via TLS 1.3",
                  "Access to production data restricted to authorized personnel via strong authentication",
                  "Access and anomaly monitoring",
                  "Encryption keys stored separately from encrypted data",
                  "Regular access and permissions review",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                In the event of a data breach likely to create a high risk to your rights and
                freedoms, Dunlo commits to informing you as soon as possible, in accordance
                with Article 34 of the GDPR.
              </p>
              <p className="mt-4">
                To report a security vulnerability, contact us at{" "}
                <a
                  href="mailto:security@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  security@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 9 */}
            <Section id="cookies" title="9. Cookies">
              <p>
                Dunlo uses a minimal number of cookies, strictly necessary for the Service to
                function:
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {[
                  {
                    name: "Session auth (Better-Auth)",
                    type: "Functional — required",
                    period: "Session / 30 days",
                    usage: "Maintain your authenticated session in the dashboard.",
                  },
                  {
                    name: "CSRF token",
                    type: "Security — required",
                    period: "Session",
                    usage: "Protection against Cross-Site Request Forgery attacks.",
                  },
                ].map(({ name, type, period, usage }) => (
                  <div key={name} className="flex flex-col gap-1 border-l border-landing-border pl-4">
                    <p className="text-sm font-semibold text-landing-text">{name}</p>
                    <p className="text-xs text-landing-accent">{type} · {period}</p>
                    <p className="text-sm text-landing-text-secondary">{usage}</p>
                  </div>
                ))}
              </div>
              <Callout>
                Dunlo does not use advertising cookies, third-party tracking, or analytics
                cookies without your explicit consent. The landing page may use aggregated
                analytics scripts (e.g. Plausible) that set no cookies.
              </Callout>
            </Section>

            {/* Section 10 */}
            <Section id="transfers" title="10. International Transfers">
              <p>
                Some of our sub-processors (Vercel, Resend, Stripe, Autumn) are based in the
                United States. These transfers are covered by{" "}
                <strong className="text-landing-text">
                  Standard Contractual Clauses (SCC)
                </strong>{" "}
                approved by the European Commission (Decision 2021/914), in accordance with
                Article 46 of the GDPR.
              </p>
              <p className="mt-4">
                You can obtain a copy of the appropriate safeguards in place by contacting{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 11 */}
            <Section id="changes" title="11. Policy Changes">
              <p>
                Dunlo reserves the right to modify this privacy policy at any time. In the
                event of a material change affecting your rights, you will be notified by
                email at least 14 days before the new provisions take effect.
              </p>
              <p className="mt-4">
                The "Last updated" date at the top of this page indicates when the policy was
                last revised. Your continued use of the Service after this date constitutes
                acceptance of the changes.
              </p>
              <p className="mt-4">
                The version history of this policy is available on request at{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 12 */}
            <Section id="contact" title="12. Contact">
              <p>
                For any question regarding this policy or the exercise of your rights, you
                can contact us:
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                  <span>
                    <strong className="text-landing-text">Email: </strong>
                    <a
                      href="mailto:privacy@dunlo.io"
                      className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                    >
                      privacy@dunlo.io
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                  <span>
                    <strong className="text-landing-text">Support: </strong>
                    <a
                      href="mailto:support@dunlo.io"
                      className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                    >
                      support@dunlo.io
                    </a>
                  </span>
                </li>
              </ul>
              <p className="mt-6 border-t border-landing-border pt-6 text-sm text-landing-text-muted">
                This policy is governed by French law. See also our{" "}
                <Link
                  href="/cgu"
                  className="text-landing-text-secondary underline underline-offset-2 transition-colors hover:text-landing-text"
                >
                  Terms of Service
                </Link>
                .
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
