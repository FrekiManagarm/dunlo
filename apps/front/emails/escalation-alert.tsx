import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { EscalationPriority } from "../lib/escalations/draft-generator";
import { dunloFontsLink, dunloStyles } from "./dunlo-styles";

const PRIORITY_LABELS: Record<EscalationPriority, string> = {
  critical: "CRITIQUE",
  high: "HAUTE",
  normal: "NORMALE",
};

const PRIORITY_COLORS: Record<EscalationPriority, string> = {
  critical: "#e53e3e",
  high: "#f59e0b",
  normal: "#8a8a8a",
};

type EscalationAlertProps = {
  customerName: string;
  customerEmail: string;
  formattedAmount: string;
  failureReason: string;
  paymentUrl: string;
  draftSubject?: string;
  draftBody?: string;
  draftMailtoLink?: string;
  priority?: EscalationPriority;
};

export function EscalationAlert({
  customerName,
  customerEmail,
  formattedAmount,
  failureReason,
  paymentUrl,
  draftSubject,
  draftBody,
  draftMailtoLink,
  priority = "normal",
}: EscalationAlertProps) {
  const priorityLabel = PRIORITY_LABELS[priority];
  const priorityColor = PRIORITY_COLORS[priority];

  return (
    <Html>
      <Head>
        <link href={dunloFontsLink} rel="stylesheet" />
      </Head>
      <Preview>
        [{priorityLabel}] Escalade — {customerName} · {formattedAmount} non
        récupéré
      </Preview>
      <Body style={dunloStyles.main}>
        <Container style={dunloStyles.container}>
          <Section style={dunloStyles.header}>
            <Text style={dunloStyles.logo}>dunlo</Text>
          </Section>

          {/* Priority badge */}
          <Text
            style={{
              color: priorityColor,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              margin: "0 0 12px",
            }}
          >
            ● Priorité {priorityLabel}
          </Text>

          <Heading style={dunloStyles.h1}>Intervention requise</Heading>
          <Text style={dunloStyles.text}>
            La séquence de relance automatique s&apos;est terminée sans
            récupération. Ce compte dépasse votre seuil d&apos;escalade et
            nécessite votre intervention directe.
          </Text>

          {/* Customer info */}
          <Section
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "20px 24px",
              margin: "0 0 24px",
            }}
          >
            <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>
                Client :{" "}
              </span>
              {customerName}
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>
                Email :{" "}
              </span>
              {customerEmail}
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>
                Montant :{" "}
              </span>
              {formattedAmount}
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>
                Raison :{" "}
              </span>
              {failureReason}
            </Text>
          </Section>

          {/* Draft message block */}
          {draftSubject && draftBody && (
            <Section
              style={{
                backgroundColor: "rgba(0,232,123,0.06)",
                borderLeft: "2px solid #00e87b",
                borderRadius: "0 8px 8px 0",
                padding: "20px 24px",
                margin: "0 0 24px",
              }}
            >
              <Text
                style={{
                  color: "#00e87b",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase" as const,
                  margin: "0 0 12px",
                }}
              >
                Draft prêt à envoyer
              </Text>
              <Text
                style={{
                  ...dunloStyles.text,
                  color: "#ebebeb",
                  fontSize: "13px",
                  margin: "0 0 8px",
                }}
              >
                <span style={{ color: "#8a8a8a" }}>Sujet : </span>
                {draftSubject}
              </Text>
              <Text
                style={{
                  ...dunloStyles.text,
                  fontSize: "13px",
                  lineHeight: "22px",
                  whiteSpace: "pre-wrap" as const,
                  margin: "0 0 16px",
                }}
              >
                {draftBody}
              </Text>
              {draftMailtoLink && (
                <Link
                  href={draftMailtoLink}
                  style={{
                    color: "#00e87b",
                    fontSize: "13px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Envoyer via Gmail →
                </Link>
              )}
            </Section>
          )}

          <Section style={dunloStyles.buttonContainer}>
            <Button style={dunloStyles.buttonUrgent} href={paymentUrl}>
              Voir le détail et intervenir
            </Button>
          </Section>
          <Text style={dunloStyles.footer}>
            Vous recevez cet email car ce paiement dépasse votre seuil
            d&apos;escalade. Rendez-vous dans vos paramètres pour ajuster ce
            seuil.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
