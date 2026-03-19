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
      <Head>
        <link href={dunloFontsLink} rel="stylesheet" />
      </Head>
      <Preview>Dernier message avant la suspension de votre accès</Preview>
      <Body style={dunloStyles.main}>
        <Container style={dunloStyles.container}>
          <Section style={dunloStyles.header}>
            <Text style={dunloStyles.logo}>dunlo</Text>
          </Section>
          <Heading style={dunloStyles.h1}>{displayName},</Heading>
          <Text style={dunloStyles.textStrong}>
            C&apos;est notre dernier message avant la suspension de votre accès.
          </Text>
          <Text style={dunloStyles.text}>
            Si vous ne mettez pas à jour votre moyen de paiement, votre accès à{" "}
            {product} sera suspendu dans 48h.
          </Text>
          <Text style={dunloStyles.text}>
            Valeur de votre abonnement : <strong style={{ color: "#ebebeb" }}>{formattedAmount}</strong>
          </Text>
          <Section style={dunloStyles.buttonContainer}>
            <Button style={dunloStyles.buttonUrgent} href={updateCardUrl}>
              Mettre à jour ma carte — dernier délai
            </Button>
          </Section>
          <Text style={dunloStyles.footer}>
            Passé ce délai, vous devrez contacter notre équipe pour réactiver
            votre compte.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
