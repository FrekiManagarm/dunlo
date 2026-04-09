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

import type { FailureCategory } from "../lib/escalations/draft-generator";
import { dunloFontsLink, dunloStyles } from "./dunlo-styles";

type RecoveryJ0Props = {
  customerName: string;
  headline: string;
  updateCardUrl: string;
  failureCategory?: FailureCategory;
};

export function RecoveryJ0({
  customerName,
  headline,
  updateCardUrl,
  failureCategory,
}: RecoveryJ0Props) {
  const displayName =
    customerName && customerName !== "Unknown" ? customerName : "Bonjour";

  const isCompromised = failureCategory === "compromised_card";
  const isInsufficientFunds = failureCategory === "insufficient_funds";

  return (
    <Html>
      <Head>
        <link href={dunloFontsLink} rel="stylesheet" />
      </Head>
      <Preview>{headline}</Preview>
      <Body style={dunloStyles.main}>
        <Container style={dunloStyles.container}>
          <Section style={dunloStyles.header}>
            <Text style={dunloStyles.logo}>dunlo</Text>
          </Section>

          <Heading style={dunloStyles.h1}>{displayName},</Heading>
          <Text style={dunloStyles.text}>{headline}</Text>

          {isCompromised && (
            <Text
              style={{
                ...dunloStyles.text,
                color: "#e53e3e",
                fontWeight: 600,
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              ⚠ Action requise — Veuillez mettre à jour votre moyen de paiement
              immédiatement pour éviter la suspension de votre accès.
            </Text>
          )}

          {isInsufficientFunds ? (
            <>
              <Section style={dunloStyles.buttonContainer}>
                <Button style={dunloStyles.button} href={updateCardUrl}>
                  Mettre à jour ma carte
                </Button>
              </Section>
              <Text
                style={{
                  ...dunloStyles.text,
                  fontSize: "14px",
                  marginTop: "8px",
                }}
              >
                Ou répondez simplement à cet email si vous souhaitez discuter
                d&apos;une solution — nous sommes flexibles.
              </Text>
            </>
          ) : (
            <Section style={dunloStyles.buttonContainer}>
              <Button
                style={isCompromised ? dunloStyles.buttonUrgent : dunloStyles.button}
                href={updateCardUrl}
              >
                {isCompromised
                  ? "Mettre à jour maintenant"
                  : "Mettre à jour ma carte"}
              </Button>
            </Section>
          )}

          <Text style={dunloStyles.footer}>
            Nous sommes là pour vous aider. Si vous avez des questions,
            n&apos;hésitez pas à nous contacter.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
