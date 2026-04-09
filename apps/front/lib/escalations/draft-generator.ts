/**
 * Personal Escalation Engine — Draft Generator
 * Génère un message personnalisé pour chaque escalade, prêt à envoyer depuis Gmail.
 * Module pur TypeScript, safe à importer dans un client bundle.
 */

export type FailureCategory =
  | "expired_card"
  | "insufficient_funds"
  | "compromised_card"
  | "generic";

export type EscalationPriority = "critical" | "high" | "normal";

export interface EscalationContext {
  customerName: string;
  customerEmail: string;
  amountCents: number;
  currency: string;
  failureCode: string;
  tenureMonths: number;
  emailsSent: number;
  daysSince: number;
}

export interface DraftMessage {
  subject: string;
  /** < 100 mots, ton humain. Contient {{update_link}} comme placeholder littéral. */
  body: string;
  /** mailto: URL pré-encodé */
  mailtoLink: string;
  category: FailureCategory;
  priority: EscalationPriority;
}

const EXPIRED_CARD_CODES = new Set([
  "expired_card",
  "card_expired",
  "do_not_honor",
  "card_velocity_exceeded",
  "generic_decline",
]);

const INSUFFICIENT_FUNDS_CODES = new Set([
  "insufficient_funds",
  "withdraw_count_limit_exceeded",
  "exceed_withdrawal_amount_limit",
]);

const COMPROMISED_CARD_CODES = new Set([
  "lost_card",
  "stolen_card",
  "pickup_card",
  "restricted_card",
]);

export function categorizeFailure(failureCode: string): FailureCategory {
  const code = (failureCode ?? "").toLowerCase().replace(/-/g, "_");
  if (EXPIRED_CARD_CODES.has(code)) return "expired_card";
  if (INSUFFICIENT_FUNDS_CODES.has(code)) return "insufficient_funds";
  if (COMPROMISED_CARD_CODES.has(code)) return "compromised_card";
  return "generic";
}

export function computePriority(
  amountCents: number,
  tenureMonths: number,
): EscalationPriority {
  const annualValueCents = amountCents * 12;
  if (annualValueCents > 300_000 || tenureMonths > 12) return "critical";
  if (annualValueCents > 120_000 || tenureMonths > 6) return "high";
  return "normal";
}

function getFirstName(fullName: string): string {
  const trimmed = fullName?.trim();
  if (!trimmed || trimmed === "Unknown") return "there";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}

export function generateDraft(ctx: EscalationContext): DraftMessage {
  const category = categorizeFailure(ctx.failureCode);
  const priority = computePriority(ctx.amountCents, ctx.tenureMonths);
  const firstName = getFirstName(ctx.customerName);

  let subject: string;
  let body: string;

  switch (category) {
    case "expired_card": {
      if (ctx.tenureMonths > 6) {
        subject = "Quick card update";
        body = `Hey ${firstName},\n\nLooks like your card may have been renewed recently — it happens. Would you mind updating it when you get a sec? Here's the direct link: {{update_link}}\n\nHappy to help if anything is unclear.\n\nThanks`;
      } else {
        subject = "Your payment — quick action needed";
        body = `Hey ${firstName},\n\nYour payment didn't go through — your card may have expired. Here's a direct link to update it in 2 clicks: {{update_link}}\n\nLet me know if you need anything.\n\nThanks`;
      }
      break;
    }

    case "insufficient_funds": {
      if (ctx.amountCents > 20_000) {
        subject = "About your payment — let's figure it out";
        body = `Hey ${firstName},\n\nHappy to work something out if timing is an issue. We can delay your next billing cycle by a few days or look at another option together.\n\nJust reply to this email — no rush. Or you can update your payment details here: {{update_link}}\n\nThanks`;
      } else {
        subject = "Your payment didn't go through";
        body = `Hey ${firstName},\n\nWe had a small issue processing your last payment. Could you check your payment details when you get a chance? {{update_link}}\n\nLet me know if there's anything I can help with.\n\nThanks`;
      }
      break;
    }

    case "compromised_card": {
      subject = "Action needed: update your payment method";
      body = `Hey ${firstName},\n\nWe received an urgent flag on your card — it may have been reported lost or stolen. Please update your payment method as soon as you can so we don't interrupt your access: {{update_link}}\n\nDon't hesitate to reach out if you have questions.\n\nThanks`;
      break;
    }

    default: {
      subject = "Your payment didn't go through";
      body = `Hey ${firstName},\n\nWe couldn't process your latest payment — it might be a temporary issue. Could you check your payment details and try again? {{update_link}}\n\nLet me know if you need anything.\n\nThanks`;
      break;
    }
  }

  const mailtoLink = `mailto:${ctx.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return { subject, body, mailtoLink, category, priority };
}
