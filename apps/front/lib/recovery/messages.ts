/**
 * Messages de recovery selon le failure code Stripe.
 * Source: https://docs.stripe.com/declines/codes
 */

import type { FailureCategory } from "../escalations/draft-generator";
export { categorizeFailure as normalizeFailureCategory } from "../escalations/draft-generator";

export const J0_MESSAGES: Record<string, { subject: string; headline: string }> = {
  // Carte expirée / renouvelée
  card_expired: {
    subject: "Votre carte a expiré — mettez-la à jour en 2 clics",
    headline: "Votre carte a expiré, voici comment la mettre à jour en 2 clics",
  },
  expired_card: {
    subject: "Votre carte a expiré — mettez-la à jour en 2 clics",
    headline: "Votre carte a expiré, voici comment la mettre à jour en 2 clics",
  },
  do_not_honor: {
    subject: "Votre carte a expiré — mettez-la à jour en 2 clics",
    headline: "Votre carte a peut-être été renouvelée récemment. Mettez-la à jour en 2 clics",
  },
  card_velocity_exceeded: {
    subject: "Votre carte a expiré — mettez-la à jour en 2 clics",
    headline: "Votre carte a peut-être été renouvelée récemment. Mettez-la à jour en 2 clics",
  },
  // Fonds insuffisants
  insufficient_funds: {
    subject: "Un problème avec votre paiement",
    headline:
      "Un problème est survenu avec votre paiement, pouvez-vous vérifier votre compte ?",
  },
  withdraw_count_limit_exceeded: {
    subject: "Un problème avec votre paiement",
    headline:
      "Un problème est survenu avec votre paiement, pouvez-vous vérifier votre compte ?",
  },
  // Carte compromise (urgence)
  lost_card: {
    subject: "Action requise : mettez à jour votre moyen de paiement",
    headline:
      "Votre carte semble avoir été signalée perdue. Mettez à jour votre moyen de paiement immédiatement.",
  },
  stolen_card: {
    subject: "Action requise : mettez à jour votre moyen de paiement",
    headline:
      "Votre carte semble avoir été signalée volée. Mettez à jour votre moyen de paiement immédiatement.",
  },
  pickup_card: {
    subject: "Action requise : mettez à jour votre moyen de paiement",
    headline:
      "Votre banque a bloqué votre carte. Mettez à jour votre moyen de paiement pour continuer.",
  },
  restricted_card: {
    subject: "Action requise : mettez à jour votre moyen de paiement",
    headline:
      "Votre carte est actuellement restreinte. Mettez à jour votre moyen de paiement pour continuer.",
  },
  // Authentification 3DS
  authentication_required: {
    subject: "Authentification requise pour votre paiement",
    headline:
      "Votre banque requiert une authentification supplémentaire. Cliquez ci-dessous pour finaliser votre paiement.",
  },
  // Refus générique
  card_declined: {
    subject: "Votre banque a refusé le paiement",
    headline: "Votre banque a refusé le paiement, voici comment résoudre ça",
  },
  // Défaut
  default: {
    subject: "Un problème avec votre paiement",
    headline:
      "Un problème est survenu avec votre paiement, voici comment le résoudre",
  },
};

export const J3_MESSAGES: Record<FailureCategory, { subject: string; headline: string }> = {
  expired_card: {
    subject: "Rappel : votre carte doit être mise à jour",
    headline: "Votre accès sera suspendu prochainement. Mettez à jour votre carte en 2 clics.",
  },
  insufficient_funds: {
    subject: "Rappel : votre paiement est en attente",
    headline: "Votre paiement n'a pas encore pu être traité. N'hésitez pas à nous contacter si besoin.",
  },
  compromised_card: {
    subject: "URGENT : votre moyen de paiement doit être mis à jour",
    headline: "Votre accès sera suspendu dans quelques jours. Mettez à jour votre moyen de paiement immédiatement.",
  },
  generic: {
    subject: "Rappel : mettez à jour votre moyen de paiement",
    headline: "Votre paiement n'a pas pu être traité. Veuillez mettre à jour vos informations de paiement.",
  },
};

export const J7_MESSAGES: Record<FailureCategory, { subject: string; headline: string }> = {
  expired_card: {
    subject: "Dernier rappel avant suspension de votre accès",
    headline: "Votre accès sera suspendu dans 48h si votre carte n'est pas mise à jour.",
  },
  insufficient_funds: {
    subject: "Dernier message avant la suspension de votre accès",
    headline: "Dernier rappel : votre accès sera suspendu dans 48h. Contactez-nous si vous avez besoin d'un délai.",
  },
  compromised_card: {
    subject: "FINAL : suspension imminente de votre accès",
    headline: "Votre accès sera suspendu dans 24h. Mettez à jour votre moyen de paiement maintenant.",
  },
  generic: {
    subject: "Dernier message avant la suspension de votre accès",
    headline: "C'est notre dernier message. Votre accès sera suspendu dans 48h si aucune action n'est prise.",
  },
};

export function getJ0Message(failureCode: string) {
  const normalized = (failureCode ?? "").toLowerCase().replace(/-/g, "_");
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
