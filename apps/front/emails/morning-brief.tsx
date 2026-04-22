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
import type { CustomerRiskProfile } from "@/lib/morning-brief";

type MorningBriefEmailProps = {
  firstName: string;
  criticalProfiles: CustomerRiskProfile[];
  warningProfiles: CustomerRiskProfile[];
  recoveredThisMonth: number;
  mrrAtRisk: number;
  currency: string;
  appUrl: string;
};

const fmt = (amount: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);

export function MorningBriefEmail({
  firstName,
  criticalProfiles,
  warningProfiles,
  recoveredThisMonth,
  mrrAtRisk,
  currency,
  appUrl,
}: MorningBriefEmailProps) {
  const criticalCount = criticalProfiles.length;
  const warningCount = warningProfiles.length;
  const totalCount = criticalCount + warningCount;

  const preview =
    criticalCount > 0
      ? `${criticalCount} compte(s) à traiter aujourd'hui`
      : totalCount > 0
        ? `${totalCount} compte(s) à surveiller`
        : "Tout va bien aujourd'hui";

  return (
    <Html>
      <Head>
        <link href={dunloFontsLink} rel="stylesheet" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={dunloStyles.main}>
        <Container style={dunloStyles.container}>
          <Section style={dunloStyles.header}>
            <Text style={dunloStyles.logo}>dunlo</Text>
          </Section>

          <Heading style={dunloStyles.h1}>Bonjour {firstName},</Heading>

          {totalCount === 0 ? (
            <Text style={dunloStyles.text}>
              ✅ Aucun compte à risque détecté aujourd'hui. Tout va bien.
            </Text>
          ) : null}

          {criticalCount > 0 ? (
            <>
              <Text style={{ ...dunloStyles.textStrong, marginBottom: "12px" }}>
                🔴 ACTION REQUISE ({criticalCount})
              </Text>
              {criticalProfiles.map((profile) => (
                <Section
                  key={profile.email}
                  style={{
                    borderLeft: "3px solid #e53e3e",
                    paddingLeft: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <Text
                    style={{ ...dunloStyles.textStrong, margin: "0 0 4px" }}
                  >
                    → {profile.email} — {fmt(profile.amount, currency)}
                  </Text>
                  <Text style={{ ...dunloStyles.text, margin: "0 0 8px" }}>
                    {profile.recommendation}
                  </Text>
                  {profile.paymentId ? (
                    <Button
                      style={{
                        ...dunloStyles.button,
                        fontSize: "13px",
                        padding: "8px 16px",
                      }}
                      href={`${appUrl}/payments/${profile.paymentId}`}
                    >
                      Voir le compte →
                    </Button>
                  ) : null}
                </Section>
              ))}
            </>
          ) : null}

          {warningCount > 0 ? (
            <>
              <Text
                style={{
                  ...dunloStyles.textStrong,
                  marginBottom: "12px",
                  marginTop: criticalCount > 0 ? "24px" : "0",
                }}
              >
                🟡 À SURVEILLER ({warningCount})
              </Text>
              {warningProfiles.map((profile) => (
                <Section
                  key={profile.email}
                  style={{
                    borderLeft: "3px solid #d4a017",
                    paddingLeft: "16px",
                    marginBottom: "16px",
                  }}
                >
                  <Text
                    style={{ ...dunloStyles.textStrong, margin: "0 0 4px" }}
                  >
                    → {profile.email} — {fmt(profile.amount, currency)}
                  </Text>
                  <Text style={{ ...dunloStyles.text, margin: "0" }}>
                    {profile.recommendation}
                  </Text>
                </Section>
              ))}
            </>
          ) : null}

          <Section
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "8px",
              padding: "16px",
              marginTop: "28px",
            }}
          >
            <Text style={{ ...dunloStyles.textStrong, margin: "0 0 4px" }}>
              ✅ CE MOIS
            </Text>
            <Text style={{ ...dunloStyles.text, margin: "0" }}>
              Récupéré : {fmt(recoveredThisMonth, currency)} · MRR à risque :{" "}
              {fmt(mrrAtRisk, currency)}
            </Text>
          </Section>

          <Section style={dunloStyles.buttonContainer}>
            <Button style={dunloStyles.button} href={`${appUrl}/dashboard`}>
              Voir le dashboard →
            </Button>
          </Section>

          <Text style={dunloStyles.footer}>
            Dunlo ·{" "}
            <a
              href={`${appUrl}/settings`}
              style={{ color: "#555555", textDecoration: "underline" }}
            >
              Modifier ces alertes
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
