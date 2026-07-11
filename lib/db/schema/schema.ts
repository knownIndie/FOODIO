import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const profileRole = pgEnum("profile_role", [
  "USER",
  "RESTAURANT_OWNER",
])

export const profiles = pgTable("profiles", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  passwordHash: text("password_hash").notNull(),
  role: profileRole("role").notNull().default("USER"),
})
