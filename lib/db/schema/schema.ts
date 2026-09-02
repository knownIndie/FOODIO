import {
  boolean,
  doublePrecision,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"

// restaurant status and section status enums
export const restaurantStatusEnum = pgEnum("restaurant_status", [
  "DRAFT",
  "PENDING_REVIEW",
  "ACTIVE",
  "REJECTED",
  "SUSPENDED",
])
export const restaurantSectionStatusEnum = pgEnum("restaurant_section_status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
])
export const ComplianceTypeEnum = pgEnum("compliance_type", [
  "TRADE_LICENSE",
  "GST",
  "FSSAI",
])
export const restaurantMemberRoleEnum = pgEnum("restaurant_member_role", [
  "OWNER",
  "MANAGER",
  "STAFF",
])

// menu item timing and food type enums
export const menuItemAvailabilityEnum = pgEnum("menu_item_availability", [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "ALL_DAY",
])
export const menuItemFoodTypeEnum = pgEnum("menu_item_food_type", [
  "BURGER",
  "PIZZA",
  "PASTA",
  "BIRYANI",
  "MOMOS",
  "SANDWICH",
  "ROLLS",
  "SALAD",
  "DESSERT",
  "DRINKS",
  "OTHER",
])
export const menuItemCuisineEnum = pgEnum("menu_cuisine", [
  "NORTH_INDIAN",
  "SOUTH_INDIAN",
  "CHINESE",
  "ITALIAN",
  "MEXICAN",
  "THAI",
  "JAPANESE",
  "KOREAN",
  "FRENCH",
  "OTHER",
])

// email verification OTPs
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

// profiles and roles
export const profiles = pgTable("profiles", {
  id: integer("id").generatedAlwaysAsIdentity().primaryKey(),
  username: text("username").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerifiedAt: timestamp("email_verified_at"),
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

// restaurants and their business details
export const restaurants = pgTable("restaurants", {
  id: uuid("restaurant_id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  address: text("address"),
  resmaplatitude: doublePrecision("resmap_latitude"),
  resmaplongitude: doublePrecision("resmap_longitude"),
  cuisineTypes: text("cuisine_types"),
  description: text("description"),
  // logo: text("logo"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: restaurantStatusEnum("status").notNull().default("DRAFT"),
})
export const restaurantBusinessDetails = pgTable(
  "restaurant_business_details",
  {
    restaurantId: uuid("restaurant_id")
      .primaryKey()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    legal_name: text("legal_name").notNull(),
    entity_type: text("entity_type").notNull(), // later to be worked
    registered_address: text("registered_address").notNull(),
    owner_or_poc_name: text("owner_or_poc_name").notNull(),
    owner_or_poc_phone: text("owner_or_poc_phone").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  }
)
export const restaurantCompliances = pgTable(
  "restaurant_compliances",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),
    type: ComplianceTypeEnum("type").notNull(),
    registration_number: text("registration_number").notNull(),
    // issued_at: timestamp("issued_at").notNull(),
    // expires_at: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    unique("restaurant_compliance_type_unique").on(
      table.restaurantId,
      table.type
    ),
  ]
)
export const restaurantBankAccounts = pgTable("restaurant_bank_accounts", {
  restaurantId: uuid("restaurant_id")
    .primaryKey()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  ifsc: text("ifsc").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
export const restaurantSetupStatus = pgTable("restaurant_setup_status", {
  restaurantId: uuid("restaurant_id")
    .primaryKey()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  restaurantBasicStatus: restaurantSectionStatusEnum("restaurant_basic_status")
    .notNull()
    .default("NOT_STARTED"),
  restaurantBusinessDetailsStatus: restaurantSectionStatusEnum(
    "restaurant_business_details_status"
  )
    .notNull()
    .default("NOT_STARTED"),
  restaurantCompliancesStatus: restaurantSectionStatusEnum(
    "restaurant_compliances_status"
  )
    .notNull()
    .default("NOT_STARTED"),
  restaurantBankAccountsStatus: restaurantSectionStatusEnum(
    "restaurant_bank_accounts_status"
  )
    .notNull()
    .default("NOT_STARTED"),
  menuItemsStatus: restaurantSectionStatusEnum("menu_items_status")
    .notNull()
    .default("NOT_STARTED"),
})

// restaurant members
export const restaurantMembers = pgTable(
  "restaurant_members",
  {
    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "cascade" }),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),

    role: restaurantMemberRoleEnum("role").notNull(),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    // Prevents adding the same profile to the same restaurant twice.
    // A profile may still belong to multiple restaurants.
    primaryKey({
      columns: [table.restaurantId, table.profileId],
    }),
  ]
)

// menu items
export const menuItems = pgTable("menu_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  restaurantId: uuid("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  priceInPaise: integer("price_in_paise").notNull(),
  isVeg: boolean("is_veg").notNull(),
  isAvailable: boolean("is_available").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  foodTypes: menuItemFoodTypeEnum("food_types").array().notNull(),
  cuisines: menuItemCuisineEnum("cuisines").array().notNull(),
  timings: menuItemAvailabilityEnum("timings").array().notNull(),
  caloriesKcal: integer("calories_kcal"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// pricing setup
export const pricingTiers = pgTable("pricing_tiers", {
  id: integer("id").primaryKey(),
  planName: text("plan_name").notNull(),
  planPrice: integer("plan_price").notNull(),
  restaurantLimit: integer("restaurant_limit").notNull(),
  staffLimit: integer("staff_limit").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // add plans via a seed
})
export const profileSubscriptions = pgTable("profile_subscriptions", {
  profileId: integer("profile_id")
    .primaryKey()
    // profileId is the primary key, so each profile can have at most one subscription row.
    .references(() => profiles.id, { onDelete: "cascade" }),

  pricingTierId: integer("pricing_tier_id")
    .notNull()
    .references(() => pricingTiers.id, { onDelete: "restrict" }),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
