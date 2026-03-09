/**
 * Messages J+0 selon le failure code Stripe.
 * Source: https://docs.stripe.com/declines/codes
 */
export const J0_MESSAGES: Record<string, { subject: string; headline: string }> = {
  card_expired: {
    subject: "Votre carte a expiré — mettez-la à jour en 2 clics",
    headline: "Votre carte a expiré, voici comment la mettre à jour en 2 clics",
  },
  expired_card: {
    subject: "Votre carte a expiré — mettez-la à jour en 2 clics",
    headline: "Votre carte a expiré, voici comment la mettre à jour en 2 clics",
  },
  insufficient_funds: {
    subject: "Un problème avec votre paiement",
    headline:
      "Un problème est survenu avec votre paiement, pouvez-vous vérifier votre compte ?",
  },
  card_declined: {
    subject: "Votre banque a refusé le paiement",
    headline: "Votre banque a refusé le paiement, voici comment résoudre ça",
  },
  default: {
    subject: "Un problème avec votre paiement",
    headline:
      "Un problème est survenu avec votre paiement, voici comment le résoudre",
  },
};

export function getJ0Message(failureCode: string) {
  const normalized = failureCode.toLowerCase().replace(/-/g, "_");
  return (
    J0_MESSAGES[normalized] ??
    J0_MESSAGES[failureCode] ??
    J0_MESSAGES.default
  );
}

/** Mapping Stripe decline_code → notre failure_code pour le copy */
export function normalizeFailureCode(stripeCode: string): string {
  const code = (stripeCode ?? "unknown").toString().toLowerCase();
  if (code === "expired_card" || code === "card_expired") return "card_expired";
  if (code === "insufficient_funds") return "insufficient_funds";
  return "card_declined";
}
