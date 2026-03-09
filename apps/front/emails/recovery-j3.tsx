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

type RecoveryJ3Props = {
  customerName: string;
  updateCardUrl: string;
};

export function RecoveryJ3({ customerName, updateCardUrl }: RecoveryJ3Props) {
  const displayName = customerName && customerName !== "Unknown" ? customerName : "Bonjour";

  return (
    <Html>
      <Head />
      <Preview>Rappel : mettez à jour votre moyen de paiement</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{displayName},</Heading>
          <Text style={text}>
            Nous vous avons contacté il y a quelques jours concernant un problème
            avec votre paiement. Votre accès sera bientôt suspendu si nous ne
            recevons pas de mise à jour.
          </Text>
          <Text style={text}>
            Mettre à jour votre carte ne prend que 2 clics — pas de friction, pas
            d’attente.
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={updateCardUrl}>
              Mettre à jour ma carte maintenant
            </Button>
          </Section>
          <Text style={footer}>
            Si vous avez déjà mis à jour vos informations, vous pouvez ignorer
            ce message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
  borderRadius: "8px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0 0 24px",
};

const text = {
  color: "#4a5568",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const buttonContainer = {
  margin: "24px 0",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600" as const,
  textDecoration: "none",
  padding: "12px 24px",
};

const footer = {
  color: "#718096",
  fontSize: "14px",
  lineHeight: "20px",
  marginTop: "24px",
};
