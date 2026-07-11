import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export type ProfileRole = "USER" | "RESTAURANT_OWNER"

export const profiles = pgTable("profiles", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  passwordHash: text("password").notNull(),
  role: text("role").$type<ProfileRole>().notNull().default("USER"),
})
