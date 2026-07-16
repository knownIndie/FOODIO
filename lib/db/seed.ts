import { drizzle } from "drizzle-orm/neon-http"
import { PLATFORM_ROLES } from "../auth/schema/roles"

import { roles } from "./schema/schema"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL not set")

const db = drizzle(connectionString)

await db
  .insert(roles)
  .values(
    PLATFORM_ROLES.map((role) => ({
      role,
    }))
  )
  .onConflictDoNothing({ target: roles.role })

console.log("Roles seeded successfully")
