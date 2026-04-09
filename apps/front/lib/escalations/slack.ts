import type { EscalationPriority } from "./draft-generator";

const PRIORITY_EMOJI: Record<EscalationPriority, string> = {
  critical: "🔴",
  high: "🟡",
  normal: "⚪",
};

const PRIORITY_LABELS: Record<EscalationPriority, string> = {
  critical: "Critique",
  high: "Haute",
  normal: "Normale",
};

interface SlackEscalationPayload {
  customerName: string;
  customerEmail: string;
  formattedAmount: string;
  tenureMonths: number;
  failureCode: string;
  priority: EscalationPriority;
  draftSubject: string;
  draftBody: string;
  mailtoLink: string;
  paymentUrl: string;
}

export async function sendEscalationSlackBlock(
  webhookUrl: string,
  payload: SlackEscalationPayload,
): Promise<void> {
  const emoji = PRIORITY_EMOJI[payload.priority];
  const priorityLabel = PRIORITY_LABELS[payload.priority];

  const blocks = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `${emoji} Escalade ${priorityLabel} — ${payload.customerName}`,
      },
    },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Montant :* ${payload.formattedAmount}/mo` },
        { type: "mrkdwn", text: `*Priorité :* ${priorityLabel}` },
        { type: "mrkdwn", text: `*Raison :* \`${payload.failureCode}\`` },
        {
          type: "mrkdwn",
          text: `*Ancienneté :* ${payload.tenureMonths} mois`,
        },
      ],
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Draft prêt à envoyer :*\n*Sujet :* ${payload.draftSubject}\n\n>${payload.draftBody.split("\n").join("\n>")}`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: { type: "plain_text", text: "Voir sur Dunlo" },
          url: payload.paymentUrl,
        },
        {
          type: "button",
          style: "primary",
          text: { type: "plain_text", text: "Envoyer via Gmail" },
          url: payload.mailtoLink,
        },
      ],
    },
  ];

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blocks }),
  });
}
