import { drizzle } from "drizzle-orm/neon-serverless"
import "server-only"

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error("DATABASE_URL is not set")

export const db = drizzle(connectionString)
