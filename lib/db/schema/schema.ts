import {
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const restaurantStatusEnum = pgEnum("restaurant_status", [
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "REJECTED",
  "SUSPENDED",
])
export const restaurantMemberRole = pgEnum("restaurant_member_role", [
  "OWNER",
  "MANAGER",
  "STAFF",
])
export const profiles = pgTable("profiles", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  password: text("password").notNull(),
})

export const emailVerificationOtps = pgTable("email_verification_otps", {
  profileId: integer("profile_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  codeHash: text("code_hash").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  failedAttempts: integer("failed_attempts").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastSentAt: timestamp("last_sent_at").notNull().defaultNow(),
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

export const restaurants = pgTable("restaurants", {
  id: integer("restaurant_id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  resmaplatitude: doublePrecision("resmap_latitude").notNull(),
  resmaplongitude: doublePrecision("resmap_longitude").notNull(),
  // cuisineTypes: text("cuisine_types"),
  description: text("description"),
  // logo: text("logo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: restaurantStatusEnum("status").notNull().default("DRAFT"),
})
export const restaurantMembers = pgTable(
  "restaurant_members",
  {
    restaurantId: integer("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    role: restaurantMemberRole("role").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    primaryKey({
      columns: [table.restaurantId, table.profileId],
    }),
  ]
)
