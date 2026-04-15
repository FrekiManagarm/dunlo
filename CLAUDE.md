# Dunlo — CLAUDE.md

## Workflow — Ruflo (OBLIGATOIRE pour tâches complexes)

Pour toute tâche complexe (multi-fichiers, nouvelles features, refactors, debug non-trivial, intégrations Stripe/webhooks, jobs Trigger.dev, schéma DB), **utiliser ruflo systématiquement** afin de :

- **Optimiser les coûts API et de session** via le routing intelligent (haiku/sonnet/opus selon complexité) et le caching des patterns.
- **Réutiliser le travail déjà vérifié** par les agents (reviewer, tester, security-auditor) au lieu de le refaire.
- **Persister la mémoire** entre sessions pour éviter de réexplorer le codebase.

### Règles d'utilisation

1. **Avant de commencer** — appeler `mcp__claude-flow__hooks_pre-task` avec la description de la tâche pour récupérer les suggestions d'agents, le routing de modèle, et les patterns existants.
2. **Rechercher la mémoire** — `mcp__claude-flow__memory_search` avec la query de la tâche pour réutiliser les décisions et patterns déjà validés.
3. **Orchestrer via swarm** si la tâche touche ≥3 domaines (UI + API + DB + webhooks par ex.) — `mcp__claude-flow__swarm_init` + `agent_spawn` (coder, reviewer, tester en parallèle).
4. **Code review automatique** — après implémentation non-triviale, dispatcher l'agent `reviewer` ou `superpowers:code-reviewer` avant de déclarer terminé.
5. **Persister le résultat** — `mcp__claude-flow__hooks_post-task` avec `storeDecisions: true` pour que les prochaines sessions héritent du contexte.
6. **Vérifier les system-reminder** `[INTELLIGENCE]` qui suggèrent des patterns avant d'écrire du code.

### Ne pas utiliser ruflo pour

- Questions triviales, typos, édits d'une ligne, commandes shell isolées.
- Tâches purement conversationnelles / explicatives.

## Vue d'ensemble du projet

Dunlo (dunlo.io) est un SaaS B2B de **failed payment recovery** pour les fondateurs SaaS bootstrappés.
Il connecte Stripe, détecte les paiements échoués en temps réel, envoie des séquences email
automatiques selon le type d'échec, et escalade les comptes à haute valeur vers le founder.

**Tagline** : Stop losing revenue to failed payments.
**Cible** : Fondateurs SaaS bootstrappés B2B, €5k–€80k MRR, sur Stripe, sans équipe dédiée.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 16 + TypeScript (App Router) |
| UI | shadcn/ui + Base UI + Tailwind CSS v4 |
| Auth | Better-Auth v1.5 |
| Base de données | PostgreSQL via Neon |
| ORM | Drizzle ORM |
| Emails | Resend + React Email |
| Webhooks | Stripe natif |
| Background jobs | Trigger.dev v4 |
| Billing | Autumn |
| Monorepo | Turborepo + Bun |
| Déploiement | Vercel |
| Domaine | dunlo.io |

---

## Structure du monorepo

```
dunlo/
├── apps/
│   └── front/              → Application Next.js principale
├── packages/
│   ├── auth/               → Configuration Better-Auth (@dunlo/auth)
│   ├── db/                 → Schéma Drizzle + client Neon (@dunlo/db)
│   ├── env/                → Validation des variables d'env (@dunlo/env)
│   └── config/             → TypeScript/ESLint configs partagés (@dunlo/config)
├── turbo.json
├── package.json            → Workspaces Bun
└── bun.lock
```

**Package manager** : Bun v1.3+
**Commandes racine** :
- `bun dev` — lance tout en parallèle
- `bun run db:push` / `db:generate` / `db:studio` / `db:migrate`
- `bun run check-types`

---

## Schéma de base de données

Localisation : `packages/db/src/schema/`

### Table `users`
```sql
users
├── id (text, PK)
├── name (text)
├── email (text, unique)
├── emailVerified (boolean)
├── image (text, nullable)
├── createdAt / updatedAt (timestamp)
├── escalationThreshold (integer, default: 200) -- seuil en € pour escalade
├── notificationEmail (text, nullable)
├── timezone (text, default: 'UTC')
├── morningBriefEnabled (boolean, default: false)
├── morningBriefTime (text, default: '07:00')
└── slackWebhookUrl (text, nullable)
```

### Tables Better-Auth
```sql
accounts    -- comptes OAuth/social liés à un user
sessions    -- sessions actives
verification -- tokens de vérification email
```

### Table `stripe_connection`
```sql
stripe_connection
├── id (uuid, PK)
├── userId (FK → users)
├── stripeAccountId (text)
├── accessToken (text, encrypted)
├── refreshToken (text, nullable)
├── webhookEndpointId (text, nullable)
├── webhookSecret (text, nullable)
├── connectedAt (timestamp)
├── lastSyncAt (timestamp, nullable)
└── isActive (boolean, default: true)
```

### Table `failed_payments`
```sql
failed_payments
├── id (uuid, PK)
├── userId (FK → users)
├── stripePaymentIntentId (text, unique)
├── customerEmail (text)
├── customerName (text)
├── amount (integer) -- en centimes
├── currency (text)
├── failureReason (text) -- card_expired / insufficient_funds / etc.
├── status (enum) -- detected / emailing / escalated / recovered / lost
├── detectedAt (timestamp)
└── recoveredAt (timestamp, nullable)
```

### Table `email_sequences`
```sql
email_sequences
├── id (uuid, PK)
├── failedPaymentId (FK → failed_payments)
├── step (integer) -- 1, 2, 3
├── scheduledAt (timestamp)
├── sentAt (timestamp, nullable)
├── openedAt (timestamp, nullable)
└── status (enum) -- pending / sent / opened / clicked / cancelled
```

### Table `escalations`
```sql
escalations
├── id (uuid, PK)
├── failedPaymentId (FK → failed_payments)
├── userId (FK → users)
├── triggeredAt (timestamp)
├── reason (text)
└── resolvedAt (timestamp, nullable)
```

### Table `subscription_events`
```sql
subscription_events
├── id (uuid, PK)
├── userId (FK → users)
├── customerEmail (text)
├── stripeSubscriptionId (text)
├── type (enum) -- downgrade / upgrade / cancelled / reactivated
├── previousAmount (integer)
├── newAmount (integer)
└── occurredAt (timestamp)
```

---

## Webhooks Stripe

### Événements écoutés
```
payment_intent.payment_failed     → créer failed_payment + planifier séquence
payment_intent.succeeded          → statut recovered + annuler emails pending
customer.subscription.deleted     → statut lost
invoice.payment_action_required   → créer failed_payment avec tag 3DS
```

### Routes webhook
- `/api/webhooks/stripe` — webhook principal
- `/api/webhooks/stripe/[accountId]` — webhooks des comptes Connect

### Règle d'idempotence (CRITIQUE)
Toujours vérifier si un `stripePaymentIntentId` existe déjà en DB avant de créer
un nouveau `failed_payment`. Stripe peut envoyer le même webhook deux fois.

### Répondre 200 immédiatement
```typescript
return NextResponse.json({ received: true }); // répondre AVANT de traiter
// traiter en async avec after() de Next.js
```

### Vérification signature
```typescript
const event = stripe.webhooks.constructEvent(
  rawBody,
  req.headers.get('stripe-signature')!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
```

---

## Auth — Better-Auth

Configuré dans `packages/auth/`. Client dans `apps/front/lib/auth-client.ts`.

- Route handler : `app/api/auth/[...all]/route.ts`
- Plugins actifs : `nextCookies`, Google OAuth (optionnel via env)
- Login : `/login`, Register : `/register`

```typescript
// Vérifier la session côté serveur
import { auth } from "@dunlo/auth";
const session = await auth.api.getSession({ headers: await headers() });
```

---

## Background jobs — Trigger.dev

Config dans `apps/front/trigger.config.ts`. Jobs dans `apps/front/trigger/`.

Jobs existants :
- `morning-brief.ts` — envoi du brief matinal (résumé escalades/paiements)

---

## Workflow des séquences email

### Templates React Email
- `emails/recovery-j0.tsx` — email immédiat (J+0)
- `emails/recovery-j3.tsx` — relance J+3
- `emails/recovery-j7.tsx` — dernier email J+7
- `emails/morning-brief.tsx` — brief matinal founder

### Timing
- **J+0** : Email immédiat après détection (dans les 30 premières minutes)
- **J+3** : Première relance
- **J+7** : Dernier email avant escalade ou lost

### Templates par failure code
- `card_expired` → "Votre carte a expiré, voici comment la mettre à jour"
- `insufficient_funds` → "Un problème est survenu avec votre paiement"
- `card_declined` → "Votre banque a refusé le paiement"
- `authentication_required` → "Une authentification est requise"
- `do_not_honor` → "Contactez votre banque ou utilisez une autre carte"

### Règles d'envoi
- Envoyer uniquement entre 9h et 18h (timezone du client si dispo, sinon UTC)
- Si `payment_intent.succeeded` reçu → annuler tous les emails `pending` immédiatement
- Ne jamais renvoyer un email déjà envoyé (idempotence stricte)

### Après J+7 — deux chemins
- Montant > `escalationThreshold` → créer escalation + alerter founder
- Montant ≤ `escalationThreshold` → passer statut à `lost`

---

## Lien de mise à jour de carte

```typescript
const session = await stripe.billingPortal.sessions.create({
  customer: customerId,
  return_url: `${process.env.APP_URL}/merci`,
  flow_data: {
    type: 'payment_method_update',
  },
});
// session.url → lien à insérer dans l'email
```

Route dédiée : `/api/update-card/[token]`

---

## Pages de l'application

| Page | Route | Description |
|---|---|---|
| Landing | `/` | Page marketing |
| Beta signup | `/beta` | Inscription à la beta |
| Login | `/login` | Connexion |
| Register | `/register` | Inscription |
| Escalations | `/(main)/escalations` | Liste des comptes à traiter |
| Settings | `/(main)/settings` | Seuil escalade, email notif, timezone, morning brief |
| Détail paiement | `/(main)/payment/[id]` | Timeline emails + actions manuelles |
| Blog | `/blog` | Blog MDX (Fumadocs) |

---

## Structure de fichiers — apps/front

```
app/
├── (main)/                        → Routes authentifiées
│   ├── escalations/
│   ├── settings/
│   └── payment/[id]/
├── api/
│   ├── auth/[...all]/             → Better-Auth handler
│   ├── autumn/[...all]/           → Autumn billing handler
│   ├── update-card/[token]/       → Lien mise à jour carte
│   ├── webhooks/stripe/           → Webhook principal + Connect
│   └── stripe/connect/fallback/   → OAuth fallback
├── beta/
├── blog/
├── login/
├── register/
└── page.tsx / layout.tsx

components/
├── ui/                            → shadcn/ui + composants custom
├── auth/                          → Composants auth
├── landing/                       → Composants landing page
└── app-navbar.tsx

lib/
├── auth-client.ts
├── evlog.ts                       → Logging (evlog)
├── morning-brief.ts
├── stripe/
│   ├── client.ts
│   ├── customer-manager.ts
│   ├── encryption.ts
│   ├── handle-payment-events.ts
│   ├── import-failed-payments.ts
│   └── webhooks.ts
└── utils.ts

emails/                            → Templates React Email
actions/                           → Server Actions
trigger/                           → Jobs Trigger.dev
proxy.ts                           → Middleware Next.js 16
```

---

## Variables d'environnement

```env
# Base de données
DATABASE_URL=postgresql://...neon.tech/...

# Better-Auth
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=https://dunlo.io

# App
APP_URL=https://dunlo.io
CORS_ORIGIN=https://dunlo.io

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_CLIENT_ID=ca_xxxxx          # pour OAuth Connect
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
ENCRYPTION_KEY=...                 # 64 char hex pour chiffrer les tokens

# Resend
RESEND_API_KEY=re_xxxxx

# Trigger.dev
TRIGGER_SECRET_KEY=tr_xxxxx

# Autumn (billing)
AUTUMN_SECRET_KEY=...

# Google OAuth (optionnel)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## Statuts des paiements échoués

```
detected   → paiement échoué détecté, séquence planifiée
emailing   → séquence en cours (J+0, J+3, J+7)
escalated  → séquence terminée, founder alerté
recovered  → paiement récupéré (à n'importe quel moment)
lost       → séquence terminée, montant < seuil, aucune action
```

---

## Tests avec Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
stripe login

# Forwarder les webhooks en local
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Cartes de test par failure code
4000000000000069  → card_expired
4000000000009995  → insufficient_funds
4000000000000002  → card_declined

# Déclencher manuellement
stripe trigger payment_intent.payment_failed
stripe trigger payment_intent.succeeded
```

---

## Pricing

| Plan | Prix | MRR couvert | Séquences | Escalade |
|---|---|---|---|---|
| Starter | €49/mo | jusqu'à €20k | 1 | ✗ |
| Growth ⭐ | €149/mo | jusqu'à €80k | 3 | ✓ |
| Scale | €399/mo | Illimité | Illimitées | ✓ |

Le plan Growth est gratuit pendant la beta. La billing est gérée via **Autumn**.

---

## Concurrents principaux

| Concurrent | Positionnement | Différence avec Dunlo |
|---|---|---|
| Churn Buster | Dunning Stripe, $350/mo min | Trop cher, mid-market |
| Churnkey | Plateforme complète, $300-990/mo | Trop complexe, cible Superhuman/Jasper |
| Redux Payments | B2C à fort volume, pricing perf | Pas notre marché |

**Notre avantage** : prix fixe transparent, setup 10 min, pensé pour early-stage sans équipe.

---

## Conventions de code

- TypeScript strict mode activé
- Pas de `any` — typer correctement les payloads Stripe
- Toujours valider la signature webhook avant de traiter
- Toujours vérifier l'idempotence avant d'insérer en DB
- Les montants sont toujours en centimes en DB, convertis en euros à l'affichage
- Les dates sont toujours en UTC en DB, converties en timezone locale à l'affichage
- Next.js 16 : toutes les request APIs sont async (`await cookies()`, `await headers()`, `await params`)
- Utiliser `proxy.ts` (pas `middleware.ts`) pour les intercepteurs de requêtes
- Les packages internes s'importent via leurs alias : `@dunlo/db`, `@dunlo/auth`, `@dunlo/env`
