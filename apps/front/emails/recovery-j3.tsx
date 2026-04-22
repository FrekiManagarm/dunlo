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

import { dunloFontsLink, dunloStyles } from "./dunlo-styles";

type RecoveryJ3Props = {
  customerName: string;
  updateCardUrl: string;
};

export function RecoveryJ3({ customerName, updateCardUrl }: RecoveryJ3Props) {
  const displayName =
    customerName && customerName !== "Unknown" ? customerName : "Bonjour";

  return (
    <Html>
      <Head>
        <link href={dunloFontsLink} rel="stylesheet" />
      </Head>
      <Preview>Rappel : mettez à jour votre moyen de paiement</Preview>
      <Body style={dunloStyles.main}>
        <Container style={dunloStyles.container}>
          <Section style={dunloStyles.header}>
            <Text style={dunloStyles.logo}>dunlo</Text>
          </Section>
          <Heading style={dunloStyles.h1}>{displayName},</Heading>
          <Text style={dunloStyles.text}>
            Nous vous avons contacté il y a quelques jours concernant un
            problème avec votre paiement. Votre accès sera bientôt suspendu si
            nous ne recevons pas de mise à jour.
          </Text>
          <Text style={dunloStyles.text}>
            Mettre à jour votre carte ne prend que 2 clics — pas de friction,
            pas d&apos;attente.
          </Text>
          <Section style={dunloStyles.buttonContainer}>
            <Button style={dunloStyles.button} href={updateCardUrl}>
              Mettre à jour ma carte maintenant
            </Button>
          </Section>
          <Text style={dunloStyles.footer}>
            Si vous avez déjà mis à jour vos informations, vous pouvez ignorer
            ce message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
