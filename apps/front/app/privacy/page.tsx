import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Dunlo",
  description:
    "Politique de confidentialité de Dunlo : comment nous collectons, utilisons et protégeons vos données personnelles.",
  robots: "noindex",
};

const SECTIONS = [
  { id: "introduction", label: "1. Introduction" },
  { id: "responsable", label: "2. Responsable de traitement" },
  { id: "donnees-collectees", label: "3. Données collectées" },
  { id: "finalites", label: "4. Finalités & bases légales" },
  { id: "sous-traitants", label: "5. Sous-traitants & partage" },
  { id: "conservation", label: "6. Durée de conservation" },
  { id: "droits", label: "7. Vos droits RGPD" },
  { id: "securite", label: "8. Sécurité" },
  { id: "cookies", label: "9. Cookies" },
  { id: "transferts", label: "10. Transferts hors UE" },
  { id: "modifications", label: "11. Modifications" },
  { id: "contact", label: "12. Contact" },
];

export default function PrivacyPage() {
  return (
    <div className="landing-grain landing-grid-bg relative min-h-svh bg-landing-bg">
      {/* Nav */}
      <nav className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-landing-border/50 bg-landing-bg/80 px-6 py-4 font-body backdrop-blur-xl md:px-10">
        <Link href="/" className="font-display text-2xl text-landing-text">
          dunlo
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
        >
          <ArrowLeft className="size-3.5" />
          Retour
        </Link>
      </nav>

      <div className="mx-auto max-w-6xl px-6 pb-32 pt-32 md:px-10">
        {/* Header */}
        <div className="mb-16 border-b border-landing-border pb-12">
          <p className="mb-4 font-body text-xs uppercase tracking-[0.2em] text-landing-accent">
            Légal
          </p>
          <h1 className="font-display text-4xl leading-tight text-landing-text md:text-5xl lg:text-6xl">
            Politique de
            <br />
            <span className="italic text-landing-text-secondary">
              confidentialité
            </span>
          </h1>
          <div className="mt-6 flex flex-wrap gap-8 font-body text-sm text-landing-text-muted">
            <span>
              Version en vigueur :{" "}
              <span className="text-landing-text-secondary">1er avril 2026</span>
            </span>
            <span>
              Dernière mise à jour :{" "}
              <span className="text-landing-text-secondary">1er avril 2026</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Sidebar TOC */}
          <aside className="shrink-0 lg:w-56">
            <div className="sticky top-28">
              <p className="mb-4 font-body text-xs uppercase tracking-[0.15em] text-landing-text-muted">
                Sommaire
              </p>
              <nav className="flex flex-col gap-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group flex items-center gap-2.5 rounded-none py-1.5 font-body text-sm text-landing-text-secondary transition-colors hover:text-landing-text"
                  >
                    <span className="h-px w-3 bg-landing-border transition-all duration-200 group-hover:w-5 group-hover:bg-landing-accent" />
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <article className="min-w-0 flex-1 font-body text-base leading-relaxed text-landing-text-secondary">
            {/* Section 1 */}
            <Section id="introduction" title="1. Introduction">
              <p>
                La présente politique de confidentialité décrit la manière dont{" "}
                <strong className="text-landing-text">Dunlo SAS</strong> (ci-après
                «&nbsp;Dunlo&nbsp;», «&nbsp;nous&nbsp;») collecte, utilise et protège les données
                personnelles des utilisateurs de la plateforme dunlo.io (ci-après
                «&nbsp;le Service&nbsp;»).
              </p>
              <p className="mt-4">
                Dunlo est engagé à respecter le Règlement Général sur la Protection des Données
                (RGPD — Règlement (UE) 2016/679) ainsi que la loi française Informatique et
                Libertés. En utilisant le Service, vous acceptez les pratiques décrites dans la
                présente politique.
              </p>
              <p className="mt-4">
                Cette politique s'applique aux données personnelles des fondateurs et équipes qui
                utilisent Dunlo (les «&nbsp;Utilisateurs&nbsp;»), ainsi qu'aux données des
                acheteurs finaux (les «&nbsp;Clients finaux&nbsp;») traitées par Dunlo pour le
                compte des Utilisateurs.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="responsable" title="2. Responsable de traitement">
              <DefinitionList
                items={[
                  {
                    term: "Entité",
                    def: "Dunlo SAS, société par actions simplifiée immatriculée au RCS de Paris.",
                  },
                  {
                    term: "Adresse",
                    def: "France (adresse complète disponible sur demande à legal@dunlo.io).",
                  },
                  {
                    term: "Contact DPO",
                    def: "privacy@dunlo.io — pour toute question relative au traitement de vos données.",
                  },
                ]}
              />
              <p className="mt-6">
                Pour les données des Clients finaux (acheteurs de l'Utilisateur), l'Utilisateur
                est le responsable de traitement au sens du RGPD. Dunlo agit en tant que
                sous-traitant et traite ces données uniquement selon les instructions de
                l'Utilisateur et dans le cadre strict du Service.
              </p>
            </Section>

            {/* Section 3 */}
            <Section id="donnees-collectees" title="3. Données collectées">
              <p className="mb-5">
                Dunlo collecte deux catégories de données personnelles distinctes :
              </p>

              <p className="mb-3">
                <strong className="text-landing-text">A. Données des Utilisateurs</strong>
              </p>
              <ul className="mb-6 flex flex-col gap-3">
                {[
                  "Identité : nom, adresse email",
                  "Authentification : hash du mot de passe ou identifiants OAuth (Google)",
                  "Préférences : timezone, seuil d'escalade, email de notification, horaire du brief matinal",
                  "Intégrations : identifiant du compte Stripe Connect, token d'accès chiffré",
                  "Données d'usage : logs de connexion, actions effectuées dans le tableau de bord",
                  "Facturation : historique d'abonnement (géré par Autumn — nous ne stockons pas les données de carte)",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mb-3">
                <strong className="text-landing-text">B. Données des Clients finaux</strong>
              </p>
              <p className="mb-4">
                Ces données nous sont transmises via l'API Stripe de l'Utilisateur et se limitent
                strictement à ce qui est nécessaire pour la récupération du paiement :
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Email et nom du client final",
                  "Montant et devise du paiement échoué",
                  "Code d'échec Stripe (ex. card_expired, insufficient_funds)",
                  "Identifiants Stripe : PaymentIntent ID, Customer ID (pour générer le lien Billing Portal)",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-border-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Callout>
                Dunlo ne collecte jamais de données de carte bancaire. Les numéros de carte, CVV
                et données sensibles de paiement restent exclusivement chez Stripe.
              </Callout>
            </Section>

            {/* Section 4 */}
            <Section id="finalites" title="4. Finalités & bases légales">
              <p className="mb-5">
                Chaque traitement repose sur une base légale explicite au sens de l'article 6
                du RGPD :
              </p>
              <div className="flex flex-col gap-5">
                {[
                  {
                    finalite: "Fourniture du Service",
                    base: "Exécution du contrat",
                    detail:
                      "Créer et gérer votre compte, connecter votre Stripe, détecter les paiements échoués et envoyer les séquences de récupération.",
                  },
                  {
                    finalite: "Facturation",
                    base: "Exécution du contrat + obligation légale",
                    detail:
                      "Gérer votre abonnement, émettre les factures et respecter les obligations comptables.",
                  },
                  {
                    finalite: "Notifications & alertes",
                    base: "Exécution du contrat",
                    detail:
                      "Vous envoyer les alertes d'escalade, le brief matinal et les notifications de votre choix.",
                  },
                  {
                    finalite: "Amélioration du Service",
                    base: "Intérêt légitime",
                    detail:
                      "Analyser les métriques d'usage agrégées et anonymisées pour améliorer les fonctionnalités.",
                  },
                  {
                    finalite: "Sécurité & fraude",
                    base: "Intérêt légitime",
                    detail:
                      "Détecter les accès non autorisés, prévenir la fraude et assurer l'intégrité du Service.",
                  },
                  {
                    finalite: "Communications marketing",
                    base: "Consentement",
                    detail:
                      "Vous envoyer des emails sur les nouveautés de Dunlo. Vous pouvez vous désabonner à tout moment.",
                  },
                ].map(({ finalite, base, detail }) => (
                  <div
                    key={finalite}
                    className="border-l border-landing-border pl-4"
                  >
                    <p className="text-sm font-semibold text-landing-text">{finalite}</p>
                    <p className="mt-0.5 text-xs text-landing-accent">{base}</p>
                    <p className="mt-1.5 text-sm text-landing-text-secondary">{detail}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 5 */}
            <Section id="sous-traitants" title="5. Sous-traitants & partage de données">
              <p className="mb-5">
                Dunlo fait appel à des sous-traitants pour fournir le Service. Ces prestataires
                agissent uniquement sur instruction de Dunlo et sont contractuellement tenus de
                respecter le RGPD :
              </p>
              <div className="flex flex-col gap-4">
                {[
                  {
                    nom: "Neon (Base de données)",
                    pays: "UE",
                    donnees: "Toutes les données applicatives",
                  },
                  {
                    nom: "Vercel (Hébergement)",
                    pays: "UE / USA (SCC)",
                    donnees: "Logs de requêtes, données en transit",
                  },
                  {
                    nom: "Resend (Emails transactionnels)",
                    pays: "USA (SCC)",
                    donnees: "Email des Clients finaux, contenu des emails de récupération",
                  },
                  {
                    nom: "Stripe (Paiement & Connect)",
                    pays: "USA (SCC)",
                    donnees: "Données de paiement, Customer ID, token d'accès",
                  },
                  {
                    nom: "Trigger.dev (Jobs asynchrones)",
                    pays: "UE",
                    donnees: "Paramètres des jobs (email, montant)",
                  },
                  {
                    nom: "Autumn (Billing)",
                    pays: "USA (SCC)",
                    donnees: "Email et historique d'abonnement Utilisateur",
                  },
                ].map(({ nom, pays, donnees }) => (
                  <div
                    key={nom}
                    className="grid grid-cols-1 gap-1 border-l border-landing-border pl-4 sm:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-sm font-semibold text-landing-text">{nom}</p>
                      <p className="mt-0.5 text-sm text-landing-text-secondary">{donnees}</p>
                    </div>
                    <span className="self-start text-xs text-landing-text-muted">{pays}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6">
                Dunlo ne vend, ne loue et ne monétise jamais vos données ni celles de vos Clients
                finaux à des tiers. Aucun partage à des fins publicitaires.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="conservation" title="6. Durée de conservation">
              <div className="flex flex-col gap-4">
                {[
                  {
                    categorie: "Données de compte Utilisateur",
                    duree: "Durée de la relation contractuelle + 3 ans (obligations comptables)",
                  },
                  {
                    categorie: "Données des Clients finaux",
                    duree: "12 mois après la résolution du paiement (recovered ou lost), puis suppression automatique",
                  },
                  {
                    categorie: "Logs de sécurité",
                    duree: "12 mois glissants",
                  },
                  {
                    categorie: "Données de facturation",
                    duree: "10 ans (obligation légale comptable)",
                  },
                  {
                    categorie: "Après résiliation du compte",
                    duree: "30 jours de rétention puis suppression définitive, sauf export demandé",
                  },
                ].map(({ categorie, duree }) => (
                  <div key={categorie} className="flex flex-col gap-1 border-l border-landing-border pl-4">
                    <dt className="text-sm font-semibold text-landing-text">{categorie}</dt>
                    <dd className="text-sm text-landing-text-secondary">{duree}</dd>
                  </div>
                ))}
              </div>
            </Section>

            {/* Section 7 */}
            <Section id="droits" title="7. Vos droits RGPD">
              <p className="mb-5">
                Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants sur
                vos données personnelles :
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  {
                    droit: "Droit d'accès",
                    desc: "Obtenir une copie des données personnelles que nous détenons sur vous.",
                  },
                  {
                    droit: "Droit de rectification",
                    desc: "Corriger des données inexactes ou incomplètes vous concernant.",
                  },
                  {
                    droit: "Droit à l'effacement",
                    desc: "Demander la suppression de vos données, sous réserve de nos obligations légales.",
                  },
                  {
                    droit: "Droit à la portabilité",
                    desc: "Recevoir vos données dans un format structuré et lisible par machine.",
                  },
                  {
                    droit: "Droit d'opposition",
                    desc: "Vous opposer à un traitement fondé sur notre intérêt légitime, notamment à des fins marketing.",
                  },
                  {
                    droit: "Droit à la limitation",
                    desc: "Demander la suspension temporaire d'un traitement pendant une contestation.",
                  },
                  {
                    droit: "Retrait du consentement",
                    desc: "Retirer à tout moment votre consentement aux traitements qui en dépendent (ex. emails marketing).",
                  },
                ].map(({ droit, desc }) => (
                  <li key={droit} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>
                      <strong className="text-landing-text">{droit} — </strong>
                      {desc}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                Pour exercer ces droits, envoyez votre demande à{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>{" "}
                en précisant votre identité. Nous répondrons dans un délai de 30 jours.
              </p>
              <p className="mt-4">
                Si vous estimez que vos droits ne sont pas respectés, vous avez la possibilité
                d'introduire une réclamation auprès de la{" "}
                <strong className="text-landing-text">CNIL</strong> (Commission Nationale de
                l'Informatique et des Libertés) : cnil.fr.
              </p>
            </Section>

            {/* Section 8 */}
            <Section id="securite" title="8. Sécurité">
              <p>
                Dunlo met en œuvre des mesures techniques et organisationnelles adaptées pour
                protéger vos données contre tout accès non autorisé, perte, altération ou
                divulgation :
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Chiffrement AES-256 des tokens d'accès Stripe au repos",
                  "Transmission des données via TLS 1.3",
                  "Accès aux données de production restreint au personnel autorisé, via authentification forte",
                  "Journalisation des accès et surveillance des anomalies",
                  "Clés de chiffrement stockées séparément des données chiffrées",
                  "Revue régulière des accès et des permissions",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                En cas de violation de données susceptible d'engendrer un risque élevé pour vos
                droits et libertés, Dunlo s'engage à vous en informer dans les meilleurs délais,
                conformément à l'article 34 du RGPD.
              </p>
              <p className="mt-4">
                Pour signaler une vulnérabilité de sécurité, contactez-nous à{" "}
                <a
                  href="mailto:security@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  security@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 9 */}
            <Section id="cookies" title="9. Cookies">
              <p>
                Dunlo utilise un nombre minimal de cookies, strictement nécessaires au
                fonctionnement du Service :
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {[
                  {
                    nom: "Session auth (Better-Auth)",
                    type: "Fonctionnel — nécessaire",
                    duree: "Session / 30 jours",
                    usage: "Maintenir votre session authentifiée dans le dashboard.",
                  },
                  {
                    nom: "CSRF token",
                    type: "Sécurité — nécessaire",
                    duree: "Session",
                    usage: "Protection contre les attaques Cross-Site Request Forgery.",
                  },
                ].map(({ nom, type, duree, usage }) => (
                  <div key={nom} className="flex flex-col gap-1 border-l border-landing-border pl-4">
                    <p className="text-sm font-semibold text-landing-text">{nom}</p>
                    <p className="text-xs text-landing-accent">{type} · {duree}</p>
                    <p className="text-sm text-landing-text-secondary">{usage}</p>
                  </div>
                ))}
              </div>
              <Callout>
                Dunlo n'utilise pas de cookies publicitaires, de tracking tiers, ni de cookies
                analytics sans votre consentement explicite. La landing page peut utiliser des
                scripts d'analyse agrégée (ex. Plausible) qui ne déposent aucun cookie.
              </Callout>
            </Section>

            {/* Section 10 */}
            <Section id="transferts" title="10. Transferts hors Union Européenne">
              <p>
                Certains de nos sous-traitants (Vercel, Resend, Stripe, Autumn) sont établis aux
                États-Unis. Ces transferts sont encadrés par les{" "}
                <strong className="text-landing-text">Clauses Contractuelles Types (SCC)</strong>{" "}
                approuvées par la Commission Européenne (décision 2021/914), conformément à
                l'article 46 du RGPD.
              </p>
              <p className="mt-4">
                Vous pouvez obtenir une copie des garanties appropriées mises en place en
                contactant{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 11 */}
            <Section id="modifications" title="11. Modifications de cette politique">
              <p>
                Dunlo se réserve le droit de modifier la présente politique de confidentialité à
                tout moment. En cas de modification substantielle affectant vos droits, vous serez
                informé par email au moins 14 jours avant l'entrée en vigueur des nouvelles
                dispositions.
              </p>
              <p className="mt-4">
                La date de «&nbsp;Dernière mise à jour&nbsp;» en haut de cette page indique quand
                la politique a été révisée pour la dernière fois. Votre utilisation continue du
                Service après cette date vaut acceptation des modifications.
              </p>
              <p className="mt-4">
                L'historique des versions de cette politique est disponible sur demande à{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 12 */}
            <Section id="contact" title="12. Contact">
              <p>
                Pour toute question relative à la présente politique ou à l'exercice de vos droits,
                vous pouvez nous contacter :
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                  <span>
                    <strong className="text-landing-text">Email :</strong>{" "}
                    <a
                      href="mailto:privacy@dunlo.io"
                      className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                    >
                      privacy@dunlo.io
                    </a>
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                  <span>
                    <strong className="text-landing-text">Support :</strong>{" "}
                    <a
                      href="mailto:support@dunlo.io"
                      className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                    >
                      support@dunlo.io
                    </a>
                  </span>
                </li>
              </ul>
              <p className="mt-6 border-t border-landing-border pt-6 text-sm text-landing-text-muted">
                Cette politique est régie par le droit français. Voir également nos{" "}
                <Link
                  href="/cgu"
                  className="text-landing-text-secondary underline underline-offset-2 transition-colors hover:text-landing-text"
                >
                  Conditions Générales d'Utilisation
                </Link>
                .
              </p>
            </Section>
          </article>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-landing-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 md:flex-row md:justify-between md:px-10">
          <Link href="/" className="font-display text-xl text-landing-text">
            dunlo
          </Link>
          <span className="font-body text-xs text-landing-text-muted">
            © {new Date().getFullYear()} Dunlo. Tous droits réservés.
          </span>
        </div>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-14 scroll-mt-28">
      <h2 className="mb-5 font-display text-xl text-landing-text md:text-2xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function DefinitionList({
  items,
}: {
  items: { term: string; def: string }[];
}) {
  return (
    <dl className="flex flex-col gap-4">
      {items.map(({ term, def }) => (
        <div key={term} className="flex flex-col gap-1 border-l border-landing-border pl-4">
          <dt className="font-body text-sm font-semibold text-landing-text">{term}</dt>
          <dd className="font-body text-sm text-landing-text-secondary">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 border-l-2 border-landing-accent bg-landing-accent/5 px-5 py-4">
      <p className="font-body text-sm text-landing-text-secondary">{children}</p>
    </div>
  );
}
