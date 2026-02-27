import { env } from "@dunlo/env/server";
// import { neon } from "@neondatabase/serverless";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";

import * as schema from "./schema";

export const db: NodePgDatabase<typeof schema> = drizzle(env.DATABASE_URL, {
  schema,
});
