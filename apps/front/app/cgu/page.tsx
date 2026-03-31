import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions Générales d'Utilisation — Dunlo",
  description:
    "Conditions générales d'utilisation de Dunlo, la solution de récupération des paiements échoués pour les fondateurs SaaS.",
  robots: "noindex",
};

const SECTIONS = [
  { id: "objet", label: "1. Objet" },
  { id: "definitions", label: "2. Définitions" },
  { id: "acces", label: "3. Accès au service" },
  { id: "compte", label: "4. Compte utilisateur" },
  { id: "services", label: "5. Services proposés" },
  { id: "prix", label: "6. Prix et facturation" },
  { id: "donnees", label: "7. Protection des données" },
  { id: "propriete", label: "8. Propriété intellectuelle" },
  { id: "responsabilite", label: "9. Responsabilité" },
  { id: "resiliation", label: "10. Résiliation" },
  { id: "droit", label: "11. Droit applicable" },
];

export default function CGUPage() {
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
            Conditions générales
            <br />
            <span className="italic text-landing-text-secondary">
              d'utilisation
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
            <Section id="objet" title="1. Objet">
              <p>
                Les présentes conditions générales d'utilisation (ci-après «&nbsp;CGU&nbsp;») régissent
                l'accès et l'utilisation de la plateforme Dunlo (ci-après «&nbsp;le Service&nbsp;»),
                éditée par{" "}
                <strong className="text-landing-text">Dunlo SAS</strong>, société par actions
                simplifiée immatriculée au RCS de Paris, dont le siège social est situé en France
                (ci-après «&nbsp;Dunlo&nbsp;»,&nbsp;«&nbsp;nous&nbsp;»).
              </p>
              <p className="mt-4">
                En accédant au Service ou en créant un compte, vous acceptez sans réserve les
                présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser
                le Service immédiatement.
              </p>
            </Section>

            {/* Section 2 */}
            <Section id="definitions" title="2. Définitions">
              <DefinitionList
                items={[
                  {
                    term: "Service",
                    def: "La plateforme Dunlo accessible via dunlo.io, permettant la récupération automatisée des paiements Stripe échoués.",
                  },
                  {
                    term: "Utilisateur",
                    def: "Toute personne physique ou morale qui accède au Service et y crée un compte.",
                  },
                  {
                    term: "Compte Connect",
                    def: "Le compte Stripe de l'Utilisateur connecté à Dunlo via l'OAuth Stripe Connect.",
                  },
                  {
                    term: "Paiement échoué",
                    def: "Tout PaymentIntent ou Invoice Stripe dont le statut est \"failed\" ou \"past_due\".",
                  },
                  {
                    term: "Séquence email",
                    def: "L'ensemble des emails automatisés envoyés par Dunlo à l'acheteur final d'un Utilisateur afin de récupérer un paiement échoué.",
                  },
                  {
                    term: "Escalade",
                    def: "L'alerte adressée à l'Utilisateur lorsqu'un paiement échoué dépasse le seuil défini dans ses paramètres.",
                  },
                ]}
              />
            </Section>

            {/* Section 3 */}
            <Section id="acces" title="3. Accès au service">
              <p>
                Le Service est accessible à toute personne disposant d'un compte Stripe actif et
                d'une connexion internet. L'accès est conditionné à la création d'un compte Dunlo
                et à la connexion d'au moins un compte Stripe via Stripe Connect.
              </p>
              <p className="mt-4">
                Dunlo se réserve le droit de suspendre ou de limiter l'accès au Service sans
                préavis en cas de violation des présentes CGU, de comportement frauduleux, ou pour
                des raisons de maintenance technique.
              </p>
              <p className="mt-4">
                L'Utilisateur est responsable de la sécurité de ses identifiants de connexion et
                doit signaler immédiatement toute utilisation non autorisée de son compte à{" "}
                <a
                  href="mailto:support@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  support@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 4 */}
            <Section id="compte" title="4. Compte utilisateur">
              <p>
                Pour utiliser le Service, l'Utilisateur doit créer un compte en fournissant une
                adresse email valide et en définissant un mot de passe sécurisé, ou en s'authentifiant
                via un fournisseur d'identité tiers (Google).
              </p>
              <p className="mt-4">
                L'Utilisateur s'engage à fournir des informations exactes et à les maintenir à
                jour. Toute information inexacte ou incomplète peut entraîner la suspension du
                compte. Un seul compte est autorisé par entité juridique.
              </p>
              <p className="mt-4">
                En connectant son compte Stripe, l'Utilisateur autorise Dunlo à accéder en lecture
                aux données de paiement, à créer des endpoints webhook sur son compte Stripe, et
                à interagir avec l'API Stripe dans le cadre strict du Service. Ces autorisations
                peuvent être révoquées à tout moment depuis le tableau de bord Stripe de
                l'Utilisateur.
              </p>
            </Section>

            {/* Section 5 */}
            <Section id="services" title="5. Services proposés">
              <p>
                Dunlo propose les fonctionnalités suivantes, selon le plan souscrit :
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {[
                  "Détection en temps réel des paiements Stripe échoués via webhooks",
                  "Envoi automatisé de séquences d'emails de récupération aux acheteurs finaux",
                  "Génération de liens Stripe Billing Portal personnalisés pour la mise à jour de moyen de paiement",
                  "Système d'escalade avec alertes email et/ou Slack pour les comptes à haute valeur",
                  "Brief matinal récapitulatif des activités de recovery",
                  "Tableau de bord de suivi des paiements échoués et récupérés",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                Dunlo n'est pas partie prenante aux transactions entre l'Utilisateur et ses
                acheteurs finaux. Le Service se limite à l'envoi de communications et à la mise
                à disposition d'outils de suivi. Dunlo ne stocke pas les données de carte bancaire
                et n'initie aucun débit.
              </p>
            </Section>

            {/* Section 6 */}
            <Section id="prix" title="6. Prix et facturation">
              <p>
                L'accès au Service est soumis à un abonnement mensuel dont les tarifs sont
                disponibles sur la page{" "}
                <Link
                  href="/#pricing"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  Tarifs
                </Link>{" "}
                du site. Les prix sont exprimés en euros, hors taxes.
              </p>
              <p className="mt-4">
                La facturation est gérée par notre partenaire de billing Autumn. Le premier
                prélèvement intervient à la fin de la période d'essai gratuite, si applicable.
                Les abonnements sont renouvelés automatiquement chaque mois, sauf résiliation
                avant la date d'échéance.
              </p>
              <p className="mt-4">
                En cas d'échec de paiement de l'abonnement Dunlo, le Service sera suspendu après
                un délai de grâce de 7 jours. L'Utilisateur sera notifié par email. Dunlo se
                réserve le droit de modifier ses tarifs en informant l'Utilisateur avec un préavis
                de 30 jours.
              </p>
              <Callout>
                Pendant la période beta, le plan Growth est accessible gratuitement. Les conditions
                tarifaires définitives seront communiquées avant la fin de la période beta.
              </Callout>
            </Section>

            {/* Section 7 */}
            <Section id="donnees" title="7. Protection des données personnelles">
              <p>
                Dans le cadre du Service, Dunlo est amené à traiter des données personnelles
                relevant de deux catégories :
              </p>
              <p className="mt-4">
                <strong className="text-landing-text">Données de l'Utilisateur&nbsp;:</strong>{" "}
                email, nom, préférences de notification, seuil d'escalade. Ces données sont
                nécessaires à la fourniture du Service et conservées pendant toute la durée de
                la relation contractuelle, puis 3 ans à des fins comptables.
              </p>
              <p className="mt-4">
                <strong className="text-landing-text">Données des acheteurs finaux&nbsp;:</strong>{" "}
                email, nom, montant de transaction. Ces données sont issues du compte Stripe de
                l'Utilisateur. L'Utilisateur est responsable de traitement au sens du RGPD pour
                ces données ; Dunlo agit en tant que sous-traitant.
              </p>
              <p className="mt-4">
                Les tokens d'accès Stripe sont chiffrés au repos (AES-256). Les données de
                paiement transitent sur des connexions TLS. Dunlo ne vend ni ne loue aucune
                donnée à des tiers. Pour exercer vos droits (accès, rectification, suppression),
                contactez{" "}
                <a
                  href="mailto:privacy@dunlo.io"
                  className="text-landing-accent underline underline-offset-2 transition-opacity hover:opacity-80"
                >
                  privacy@dunlo.io
                </a>
                .
              </p>
            </Section>

            {/* Section 8 */}
            <Section id="propriete" title="8. Propriété intellectuelle">
              <p>
                L'ensemble des éléments constituant le Service (code source, interfaces,
                algorithmes, marques, logos, contenus) est la propriété exclusive de Dunlo
                ou de ses concédants de licence. Toute reproduction, modification, distribution
                ou exploitation, même partielle, sans autorisation écrite préalable de Dunlo,
                est strictement interdite.
              </p>
              <p className="mt-4">
                L'Utilisateur conserve la propriété de ses données. En utilisant le Service,
                il accorde à Dunlo une licence limitée, non exclusive, pour traiter ces données
                dans le strict cadre de la fourniture du Service.
              </p>
              <p className="mt-4">
                L'utilisation du Service ne confère à l'Utilisateur aucun droit de propriété
                intellectuelle sur le Service ou ses composants.
              </p>
            </Section>

            {/* Section 9 */}
            <Section id="responsabilite" title="9. Limitation de responsabilité">
              <p>
                Le Service est fourni «&nbsp;en l'état&nbsp;». Dunlo s'engage à maintenir une
                disponibilité supérieure à 99,5% sur une base mensuelle, hors maintenance
                planifiée notifiée en avance.
              </p>
              <p className="mt-4">
                Dunlo ne peut être tenu responsable des pertes de revenus résultant de :
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {[
                  "Indisponibilités de l'API Stripe indépendantes de Dunlo",
                  "Emails de récupération marqués comme spam par les serveurs destinataires",
                  "Décisions des acheteurs finaux de ne pas mettre à jour leur moyen de paiement",
                  "Utilisations non conformes du Service par l'Utilisateur",
                  "Cas de force majeure",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-landing-border-strong" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6">
                La responsabilité totale de Dunlo, toutes causes confondues, est plafonnée au
                montant des sommes effectivement versées par l'Utilisateur au cours des 3 mois
                précédant l'événement ayant causé le dommage.
              </p>
            </Section>

            {/* Section 10 */}
            <Section id="resiliation" title="10. Résiliation">
              <p>
                L'Utilisateur peut résilier son abonnement à tout moment depuis son espace
                client. La résiliation prend effet à la fin de la période de facturation en
                cours. Aucun remboursement au prorata n'est accordé.
              </p>
              <p className="mt-4">
                Dunlo peut résilier ou suspendre le compte de l'Utilisateur sans préavis en
                cas de : violation des présentes CGU, comportement abusif, non-paiement prolongé,
                ou activité frauduleuse détectée.
              </p>
              <p className="mt-4">
                À la suite de la résiliation, les données de l'Utilisateur sont conservées
                pendant 30 jours puis supprimées définitivement, sauf obligation légale contraire.
                L'Utilisateur peut demander l'export de ses données avant la suppression.
              </p>
            </Section>

            {/* Section 11 */}
            <Section id="droit" title="11. Droit applicable et litiges">
              <p>
                Les présentes CGU sont régies par le droit français. En cas de litige relatif
                à leur interprétation ou leur exécution, les parties s'engagent à rechercher
                une solution amiable avant tout recours judiciaire.
              </p>
              <p className="mt-4">
                À défaut d'accord amiable dans un délai de 30 jours à compter de la notification
                du litige par l'une des parties, les tribunaux compétents du ressort de Paris
                auront compétence exclusive.
              </p>
              <p className="mt-4">
                Si une clause des présentes CGU est déclarée nulle ou inapplicable, les autres
                clauses demeurent en vigueur.
              </p>
              <p className="mt-6 border-t border-landing-border pt-6 text-sm text-landing-text-muted">
                Pour toute question relative aux présentes CGU :{" "}
                <a
                  href="mailto:legal@dunlo.io"
                  className="text-landing-text-secondary underline underline-offset-2 transition-colors hover:text-landing-text"
                >
                  legal@dunlo.io
                </a>
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
