import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Configure Neon for serverless with connection pooling
const sql = neon(process.env.DATABASE_URL, {
  fetchOptions: {
    cache: "no-store", // Disable caching for fresh data
  },
});

// Create Drizzle instance with schema
export const db = drizzle(sql, { schema });

// Export a helper to create a new connection for each serverless invocation
export function getDb() {
  return db;
}
