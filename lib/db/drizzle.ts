import { drizzle as createNeonDatabase } from "drizzle-orm/neon-serverless"
import { drizzle as createPostgresDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import "server-only"
import { getServiceMode } from "@/lib/config/service-mode"

function databaseUrl() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL is not set")
  return connectionString
}

const connectionString = databaseUrl()

type FoodioDatabase = ReturnType<typeof createNeonDatabase>

function createDatabase(): FoodioDatabase {
  if (getServiceMode() === "hosted") {
    return createNeonDatabase(connectionString)
  }

  const globalForDatabase = globalThis as typeof globalThis & {
    foodioLocalPostgresPool?: Pool
  }
  const pool =
    globalForDatabase.foodioLocalPostgresPool ?? new Pool({ connectionString })

  globalForDatabase.foodioLocalPostgresPool = pool

  return createPostgresDatabase({ client: pool }) as unknown as FoodioDatabase
}

export const db = createDatabase()
