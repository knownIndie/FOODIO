import { drizzle as createNeonDatabase } from "drizzle-orm/neon-http"
import { drizzle as createPostgresDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { PLATFORM_ROLES } from "../auth/schema/roles"
import { getServiceMode } from "../config/service-mode"

import { roles } from "./schema/schema"

function databaseUrl() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL not set")
  return connectionString
}

const connectionString = databaseUrl()

const serviceMode = getServiceMode()
const pool =
  serviceMode === "local" ? new Pool({ connectionString }) : undefined
const db =
  serviceMode === "local"
    ? (createPostgresDatabase({
        client: pool as Pool,
      }) as unknown as ReturnType<typeof createNeonDatabase>)
    : createNeonDatabase(connectionString)

try {
  await db
    .insert(roles)
    .values(
      PLATFORM_ROLES.map((role) => ({
        role,
      }))
    )
    .onConflictDoNothing({ target: roles.role })

  console.log(`Roles seeded successfully in ${serviceMode} mode`)
} finally {
  await pool?.end()
}
