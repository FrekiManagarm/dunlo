import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { dunloFontsLink, dunloStyles } from "./dunlo-styles";

type EscalationAlertProps = {
  customerName: string;
  customerEmail: string;
  formattedAmount: string;
  failureReason: string;
  paymentUrl: string;
};

export function EscalationAlert({
  customerName,
  customerEmail,
  formattedAmount,
  failureReason,
  paymentUrl,
}: EscalationAlertProps) {
  return (
    <Html>
      <Head>
        <link href={dunloFontsLink} rel="stylesheet" />
      </Head>
      <Preview>
        Escalade — {customerName} · {formattedAmount} non récupéré
      </Preview>
      <Body style={dunloStyles.main}>
        <Container style={dunloStyles.container}>
          <Section style={dunloStyles.header}>
            <Text style={dunloStyles.logo}>dunlo</Text>
          </Section>
          <Heading style={dunloStyles.h1}>
            Intervention requise
          </Heading>
          <Text style={dunloStyles.text}>
            La séquence de relance automatique s&apos;est terminée sans
            récupération. Ce compte dépasse votre seuil d&apos;escalade et
            nécessite votre intervention directe.
          </Text>
          <Section
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "20px 24px",
              margin: "0 0 24px",
            }}
          >
            <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>Client : </span>
              {customerName}
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>Email : </span>
              {customerEmail}
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>Montant : </span>
              {formattedAmount}
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0" }}>
              <span style={{ color: "#ebebeb", fontWeight: 600 }}>Raison : </span>
              {failureReason}
            </Text>
          </Section>
          <Section style={dunloStyles.buttonContainer}>
            <Button style={dunloStyles.buttonUrgent} href={paymentUrl}>
              Voir le détail et intervenir
            </Button>
          </Section>
          <Text style={dunloStyles.footer}>
            Vous recevez cet email car ce paiement dépasse votre seuil
            d&apos;escalade. Rendez-vous dans vos paramètres pour ajuster ce seuil.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
