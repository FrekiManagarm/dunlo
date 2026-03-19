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

type RecoveryJ0Props = {
  customerName: string;
  headline: string;
  updateCardUrl: string;
};

export function RecoveryJ0({ customerName, headline, updateCardUrl }: RecoveryJ0Props) {
  const displayName = customerName && customerName !== "Unknown" ? customerName : "Bonjour";

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
          <Section style={dunloStyles.buttonContainer}>
            <Button style={dunloStyles.button} href={updateCardUrl}>
              Mettre à jour ma carte
            </Button>
          </Section>
          <Text style={dunloStyles.footer}>
            Nous sommes là pour vous aider. Si vous avez des questions, n&apos;hésitez
            pas à nous contacter.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
