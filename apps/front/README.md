# Dunlo Front (Next.js)

Application principale Dunlo — payment recovery pour SaaS.

## Stack

- Next.js 16 (App Router)
- Better Auth
- Stripe
- Drizzle ORM
- shadcn/ui

## Configuration

1. Copier `.env.example` vers `.env.local` à la racine du monorepo (ou dans `apps/front/`)
2. Remplir les variables d'environnement

## Développement

```bash
bun run dev:front
```

## Migration depuis apps/web (TanStack Start)

Cette app a été migrée depuis `apps/web`. Adaptations principales :

- **Routes** : TanStack Router → Next.js App Router (file-based)
- **Server functions** : `createServerFn` → Server Actions (`"use server"`)
- **Data fetching** : `loader` → `getData()` dans les Server Components
- **Auth** : `tanstackStartCookies` → `nextCookies` dans `@dunlo/auth`
- **API** : Routes API TanStack → `app/api/*/route.ts`
- **Auth protection** : `beforeLoad` → Middleware Next.js
