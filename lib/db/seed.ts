import { drizzle } from "drizzle-orm/neon-http"
import { PLATFORM_ROLES } from "../auth/schema/roles"
import { roles } from "./schema/schema"

function databaseUrl() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL not set")
  return connectionString
}

const db = drizzle(databaseUrl())

await db
  .insert(roles)
  .values(
    PLATFORM_ROLES.map((role) => ({
      role,
    }))
  )
  .onConflictDoNothing({ target: roles.role })

console.log("Roles seeded successfully")
