import { createEnv } from "@t3-oss/env-nextjs";

/**
 * Variables d'environnement côté client.
 * Next.js : préfixe NEXT_PUBLIC_
 * Déclarez ici les clés exposées au client.
 */
export const env = createEnv({
  client: {},
  runtimeEnv: {},
  emptyStringAsUndefined: true,
});
