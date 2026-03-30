import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@dunlo/db";
import { failedPayments, subscriptionEvents, users } from "@dunlo/db/schema";
import { Resend } from "resend";
import { env } from "@dunlo/env/server";
import { getConnectedStripeClient } from "./stripe/client";
import { decrypt } from "./stripe/encryption";
import { createElement } from "react";
import { MorningBriefEmail } from "@/emails/morning-brief";

export type SignalType =
  | "failed_payment"
  | "repeated_failures"
  | "downgrade"
  | "card_expiring";

export type Severity = "critical" | "warning";

export interface RiskSignal {
  type: SignalType;
  severity: Severity;
  details?: string;
  daysUntilExpiry?: number;
}

export interface CustomerRiskProfile {
  email: string;
  amount: number;
  currency: string;
  paymentId?: string;
  signals: RiskSignal[];
  score: number;
  recommendation: string;
}

export interface MorningBriefData {
  criticalProfiles: CustomerRiskProfile[];
  warningProfiles: CustomerRiskProfile[];
  recoveredThisMonth: number;
  mrrAtRisk: number;
  currency: string;
}

export function getRiskScore(signals: RiskSignal[]): number {
  let score = 0;

  for (const signal of signals) {
    switch (signal.type) {
      case "failed_payment":
        score += signal.severity === "critical" ? 40 : 25;
        break;
      case "repeated_failures":
        score += 35;
        break;
      case "downgrade":
        score += 30;
        break;
      case "card_expiring":
        score += 20;
        break;
    }
  }

  return Math.min(score, 100);
}

export function getRecommendedAction(signals: RiskSignal[]): string {
  const types = new Set(signals.map((s) => s.type));

  if (types.has("failed_payment") && types.has("repeated_failures")) {
    return "Contacte ce client directement aujourd'hui.";
  }
  if (types.has("downgrade") && types.has("failed_payment")) {
    return "A downgrade récemment ET un paiement échoué. Risque de churn élevé.";
  }
  if (types.has("card_expiring") && types.has("failed_payment")) {
    const exp = signals.find((s) => s.type === "card_expiring");
    return `Carte expire dans ${exp?.daysUntilExpiry ?? "?"} jours + paiement échoué. Envoie le lien de mise à jour maintenant.`;
  }
  if (types.has("card_expiring")) {
    const exp = signals.find((s) => s.type === "card_expiring");
    return `Carte expire dans ${exp?.daysUntilExpiry ?? "?"} jours. Anticipe avant l'échec.`;
  }
  if (types.has("repeated_failures")) {
    return "Plusieurs échecs ces 90 derniers jours. Surveille ce compte.";
  }
  if (types.has("downgrade")) {
    return "A downgrade récemment. Prends contact pour comprendre.";
  }
  return "À surveiller.";
}

export async function collectSignalsForUser(
  userId: string,
  escalationThreshold: number,
  stripeAccessToken: string | null,
): Promise<Map<string, CustomerRiskProfile>> {
  const profileMap = new Map<string, CustomerRiskProfile>();

  function getOrCreate(email: string, amount: number, currency: string, paymentId?: string): CustomerRiskProfile {
    let p = profileMap.get(email);
    if (!p) {
      p = { email, amount, currency, paymentId, signals: [], score: 0, recommendation: "" };
      profileMap.set(email, p);
    }
    if (amount > p.amount) {
      p.amount = amount;
      p.paymentId = paymentId;
    }
    return p;
  }

  // Signal 1: failed payments in last 7 days with status detected or emailing
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recentFailed = await db.query.failedPayments.findMany({
    where: and(
      eq(failedPayments.userId, userId),
      gte(failedPayments.detectedAt, sevenDaysAgo),
    ),
    columns: {
      id: true,
      customerEmail: true,
      amount: true,
      currency: true,
      status: true,
    },
  });

  for (const fp of recentFailed) {
    if (fp.status !== "detected" && fp.status !== "emailing") continue;
    const severity: Severity =
      fp.amount > escalationThreshold * 100 ? "critical" : "warning";
    const profile = getOrCreate(fp.customerEmail, fp.amount, fp.currency, fp.id);
    profile.signals.push({ type: "failed_payment", severity });
  }

  // Signal 3: repeated failures (2+ in last 90 days)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const repeatedResult = await db
    .select({
      customerEmail: failedPayments.customerEmail,
      count: sql<number>`count(*)::int`,
      maxAmount: sql<number>`max(${failedPayments.amount})`,
      currency: failedPayments.currency,
    })
    .from(failedPayments)
    .where(
      and(
        eq(failedPayments.userId, userId),
        gte(failedPayments.detectedAt, ninetyDaysAgo),
      ),
    )
    .groupBy(failedPayments.customerEmail, failedPayments.currency);

  for (const row of repeatedResult) {
    if (row.count < 2) continue;
    const profile = getOrCreate(row.customerEmail, row.maxAmount, row.currency);
    profile.signals.push({ type: "repeated_failures", severity: "critical" });
  }

  // Signal 4: downgrades in last 14 days
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const recentDowngrades = await db.query.subscriptionEvents.findMany({
    where: and(
      eq(subscriptionEvents.userId, userId),
      eq(subscriptionEvents.type, "downgrade"),
      gte(subscriptionEvents.occurredAt, fourteenDaysAgo),
    ),
    columns: {
      customerEmail: true,
      newAmount: true,
    },
  });

  for (const dg of recentDowngrades) {
    const profile = getOrCreate(dg.customerEmail, dg.newAmount, "eur");
    profile.signals.push({ type: "downgrade", severity: "warning" });
  }

  // Signal 2: cards expiring in next 30 days (via Stripe API)
  if (stripeAccessToken) {
    try {
      const stripe = getConnectedStripeClient(stripeAccessToken, { alreadyDecrypted: true });
      const customers = await stripe.customers.list({ limit: 100, expand: ["data.invoice_settings.default_payment_method"] });

      const now = new Date();
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      for (const customer of customers.data) {
        if (!customer.email) continue;
        const pm = customer.invoice_settings?.default_payment_method;
        if (!pm || typeof pm === "string") continue;
        const card = pm.card;
        if (!card?.exp_month || !card?.exp_year) continue;

        const expiry = new Date(card.exp_year, card.exp_month - 1, 1);
        if (expiry > thirtyDaysFromNow) continue;

        const msUntilExpiry = expiry.getTime() - now.getTime();
        const daysUntilExpiry = Math.max(0, Math.ceil(msUntilExpiry / (24 * 60 * 60 * 1000)));

        const profile = getOrCreate(customer.email, 0, "eur");
        profile.signals.push({
          type: "card_expiring",
          severity: "warning",
          daysUntilExpiry,
        });
      }
    } catch {
      // Non-blocking: Stripe API failure should not prevent the brief from sending
    }
  }

  // Compute scores and recommendations
  for (const profile of profileMap.values()) {
    profile.score = getRiskScore(profile.signals);
    profile.recommendation = getRecommendedAction(profile.signals);
  }

  return profileMap;
}

export async function computeBriefData(userId: string, escalationThreshold: number, stripeAccessToken: string | null): Promise<MorningBriefData> {
  const profileMap = await collectSignalsForUser(userId, escalationThreshold, stripeAccessToken);

  const allProfiles = Array.from(profileMap.values()).filter((p) => p.signals.length > 0);
  const criticalProfiles = allProfiles
    .filter((p) => p.score >= 60)
    .sort((a, b) => b.score - a.score);
  const warningProfiles = allProfiles
    .filter((p) => p.score >= 30 && p.score < 60)
    .sort((a, b) => b.score - a.score);

  // MRR stats
  const firstOfMonth = new Date();
  firstOfMonth.setDate(1);
  firstOfMonth.setHours(0, 0, 0, 0);

  const recoveredResult = await db
    .select({ total: sql<number>`coalesce(sum(${failedPayments.amount}), 0)::int` })
    .from(failedPayments)
    .where(
      and(
        eq(failedPayments.userId, userId),
        eq(failedPayments.status, "recovered"),
        gte(failedPayments.recoveredAt!, firstOfMonth),
      ),
    );

  const recoveredThisMonth = recoveredResult[0]?.total ?? 0;

  const atRiskResult = await db
    .select({ total: sql<number>`coalesce(sum(${failedPayments.amount}), 0)::int` })
    .from(failedPayments)
    .where(
      and(
        eq(failedPayments.userId, userId),
        sql`${failedPayments.status} in ('detected', 'emailing', 'escalated')`,
      ),
    );

  const mrrAtRisk = atRiskResult[0]?.total ?? 0;

  return {
    criticalProfiles,
    warningProfiles,
    recoveredThisMonth,
    mrrAtRisk,
    currency: "EUR",
  };
}

export async function generateAndSendBrief(
  user: {
    id: string;
    name: string;
    email: string;
    notificationEmail: string | null;
    escalationThreshold: number | null;
    slackWebhookUrl: string | null;
    morningBriefTime: string;
  },
  stripeAccessToken: string | null,
): Promise<{ sent: boolean; reason?: string }> {
  const targetEmail = user.notificationEmail || user.email;
  const escalationThreshold = user.escalationThreshold ?? 200;

  const rawToken = stripeAccessToken ? decrypt(stripeAccessToken) : null;
  const brief = await computeBriefData(user.id, escalationThreshold, rawToken);

  const totalAtRisk = brief.criticalProfiles.length + brief.warningProfiles.length;
  const appUrl = env.APP_URL;

  // Send email
  const resend = new Resend(env.RESEND_API_KEY);
  const from = (process.env.RESEND_FROM as string) ?? "Dunlo <no-reply@biume.com>";

  const criticalCount = brief.criticalProfiles.length;
  const subject =
    criticalCount > 0
      ? `⚡ ${criticalCount} compte(s) à traiter aujourd'hui — Dunlo`
      : totalAtRisk > 0
        ? `📊 ${totalAtRisk} compte(s) à surveiller — Dunlo`
        : `✅ Tout va bien aujourd'hui — Dunlo`;

  const react = createElement(MorningBriefEmail, {
    firstName: user.name.split(" ")[0] ?? user.name,
    criticalProfiles: brief.criticalProfiles,
    warningProfiles: brief.warningProfiles,
    recoveredThisMonth: brief.recoveredThisMonth,
    mrrAtRisk: brief.mrrAtRisk,
    currency: brief.currency,
    appUrl,
  });

  await resend.emails.send({
    from,
    to: [targetEmail],
    subject,
    react,
  });

  // Send Slack if configured
  if (user.slackWebhookUrl) {
    await sendSlackBrief(user.slackWebhookUrl, brief, appUrl);
  }

  return { sent: true };
}

async function sendSlackBrief(
  webhookUrl: string,
  brief: MorningBriefData,
  appUrl: string,
): Promise<void> {
  const fmt = (amount: number) =>
    new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: brief.currency,
      minimumFractionDigits: 0,
    }).format(amount / 100);

  const criticalCount = brief.criticalProfiles.length;
  const warningCount = brief.warningProfiles.length;
  const totalCount = criticalCount + warningCount;

  const headerText =
    totalCount === 0
      ? "✅ Tout va bien aujourd'hui"
      : criticalCount > 0
        ? `⚡ ${criticalCount} compte(s) à traiter aujourd'hui`
        : `📊 ${warningCount} compte(s) à surveiller`;

  const blocks: unknown[] = [
    {
      type: "header",
      text: { type: "plain_text", text: headerText, emoji: true },
    },
  ];

  for (const profile of brief.criticalProfiles) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🔴 ${profile.email}* — ${fmt(profile.amount)}\n${profile.recommendation}`,
      },
      accessory: profile.paymentId
        ? {
            type: "button",
            text: { type: "plain_text", text: "Voir →" },
            url: `${appUrl}/payments/${profile.paymentId}`,
          }
        : undefined,
    });
  }

  if (criticalCount > 0 && warningCount > 0) {
    blocks.push({ type: "divider" });
  }

  for (const profile of brief.warningProfiles) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*🟡 ${profile.email}* — ${fmt(profile.amount)}\n${profile.recommendation}`,
      },
    });
  }

  blocks.push({ type: "divider" });
  blocks.push({
    type: "section",
    text: {
      type: "mrkdwn",
      text: `Récupéré ce mois : *${fmt(brief.recoveredThisMonth)}* · MRR à risque : *${fmt(brief.mrrAtRisk)}*`,
    },
    accessory: {
      type: "button",
      text: { type: "plain_text", text: "Dashboard →" },
      url: `${appUrl}/dashboard`,
    },
  });

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
}
