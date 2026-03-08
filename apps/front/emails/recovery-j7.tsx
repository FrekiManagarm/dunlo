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

type RecoveryJ7Props = {
  customerName: string;
  productName: string;
  formattedAmount: string;
  updateCardUrl: string;
};

export function RecoveryJ7({
  customerName,
  productName,
  formattedAmount,
  updateCardUrl,
}: RecoveryJ7Props) {
  const displayName = customerName && customerName !== "Unknown" ? customerName : "Bonjour";
  const product = productName || "votre abonnement";

  return (
    <Html>
      <Head />
      <Preview>Dernier message avant la suspension de votre accès</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{displayName},</Heading>
          <Text style={textStrong}>
            C’est notre dernier message avant la suspension de votre accès.
          </Text>
          <Text style={text}>
            Si vous ne mettez pas à jour votre moyen de paiement, votre accès à{" "}
            {product} sera suspendu dans 48h.
          </Text>
          <Text style={text}>
            Valeur de votre abonnement : <strong>{formattedAmount}</strong>
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={updateCardUrl}>
              Mettre à jour ma carte — dernier délai
            </Button>
          </Section>
          <Text style={footer}>
            Passé ce délai, vous devrez contacter notre équipe pour réactiver
            votre compte.
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

const textStrong = {
  color: "#1a1a1a",
  fontSize: "16px",
  fontWeight: "600" as const,
  lineHeight: "24px",
  margin: "0 0 16px",
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
  backgroundColor: "#dc2626",
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
