import "server-only";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

declare global {
  var breadboardDbPool: Pool | undefined;
}

const connectionString = process.env.DATABASE_URL;
const useSsl =
  process.env.DATABASE_SSL !== "false" &&
  !connectionString?.includes("localhost") &&
  !connectionString?.includes("127.0.0.1");

if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}

const pool =
  globalThis.breadboardDbPool ??
  new Pool({
    connectionString,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.breadboardDbPool = pool;
}

export const db = drizzle(pool, { schema });
