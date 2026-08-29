import { drizzle } from "drizzle-orm/neon-serverless"
import "server-only"

function databaseUrl() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not set")
  return connectionString
}

export const db = drizzle(databaseUrl())
