import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  password: text("password").notNull(),
  role: text("role"),
})
