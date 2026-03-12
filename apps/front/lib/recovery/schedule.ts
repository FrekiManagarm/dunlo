/**
 * Calcule le prochain créneau d'envoi entre 9h et 18h.
 * Timezone du client si dispo, sinon UTC.
 */
export function nextSendWindow(
  fromDate: Date,
  delayDays: number,
  timezone = "UTC",
): Date {
  const target = new Date(fromDate);
  target.setUTCDate(target.getUTCDate() + delayDays);

  if (delayDays === 0) {
    // J+0 : envoyer maintenant si dans 9h-18h, sinon prochain 9h
    const now = new Date();
    const tzHour = parseInt(
      now.toLocaleString("fr-FR", {
        timeZone: timezone,
        hour: "2-digit",
        hour12: false,
      }),
      10,
    );

    if (tzHour >= 9 && tzHour < 18) {
      return now;
    }
    if (tzHour >= 18) {
      target.setUTCDate(target.getUTCDate() + 1);
    }
  }

  // 10h UTC pour J+0 (hors fenêtre), J+3, J+7
  target.setUTCHours(10, 0, 0, 0);
  return target;
}
