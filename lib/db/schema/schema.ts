import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const profiles = pgTable("profiles", {
  id: integer("profile_id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  password: text("password").notNull(),
})

export const roles = pgTable("roles", {
  id: integer("role_id").primaryKey().generatedAlwaysAsIdentity(),
  role: text("role").notNull().unique(),
})

export const profileRoles = pgTable(
  "profile_roles",
  {
    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.profileId, table.roleId],
    }),
  ]
)
