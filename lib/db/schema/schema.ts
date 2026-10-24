import { sql } from "drizzle-orm"
import {
  boolean,
  check,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core"
import type { deliveryAddress } from "@/lib/checkout/address-schema"
import {
  menuItemAvailabilities,
  menuItemCuisines,
  menuItemFoodTypes,
} from "@/lib/dashboard-menu/constants"

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
export const menuItemAvailabilityEnum = pgEnum(
  "menu_item_availability",
  menuItemAvailabilities
)
export const menuItemFoodTypeEnum = pgEnum(
  "menu_item_food_type",
  menuItemFoodTypes
)
export const menuItemCuisineEnum = pgEnum("menu_cuisine", menuItemCuisines)

// profiles and roles enums
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

// razorpay payment realted enums
export const foodOrderPaymentStatusEnum = pgEnum("food_order_payment_status", [
  "PENDING",
  "PAID",
])

export const paymentAttemptStatusEnum = pgEnum("payment_attempt_status", [
  "CREATED", // Razorpay created the payment
  "AUTHORIZED", // Payment approved; capture is pending
  "CAPTURED", // Payment captured successfully
  "FAILED", // Razorpay confirmed the payment failed
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

  staffLimit: integer("staff_limit").notNull(),
  restaurantLimit: integer("restaurant_limit").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// razor pay payment related tables

// food orders table with customer, restaurant, and payment details and razorpay order id
export const foodOrders = pgTable(
  "food_orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: integer("customer_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),

    restaurantId: uuid("restaurant_id")
      .notNull()
      .references(() => restaurants.id, { onDelete: "restrict" }),

    checkoutRequestId: uuid("checkout_request_id").notNull(),

    deliveryAddress: jsonb("delivery_address")
      .$type<deliveryAddress>()
      .notNull(),

    subtotalInPaise: integer("subtotal_in_paise").notNull(),
    deliveryFeeInPaise: integer("delivery_fee_in_paise").notNull(),
    taxInPaise: integer("tax_in_paise").notNull(),
    discountInPaise: integer("discount_in_paise").notNull(),
    amountInPaise: integer("amount_in_paise").notNull(),

    currency: text("currency").notNull().default("INR"),

    razorpayOrderId: text("razorpay_order_id").unique(),
    razorpayOrderCreationStartedAt: timestamp(
      "razorpay_order_creation_started_at",
      { withTimezone: true }
    ),

    paymentStatus: foodOrderPaymentStatusEnum("payment_status")
      .notNull()
      .default("PENDING"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    paidAt: timestamp("paid_at", { withTimezone: true }),
  },
  (table) => [
    unique("food_orders_checkout_request_unique").on(
      table.customerId,
      table.checkoutRequestId
    ),

    index("food_orders_customer_idx").on(table.customerId),
    // index : adds a database index for faster lookups on the customerId column
    check("food_orders_amount_positive", sql`${table.amountInPaise} > 0`),
    // check : adds database rules, such as “quantity must be positive
    check(
      "food_orders_amounts_check",
      // sql: Allows us to write SQL expressions. When used inside check(), the expression must evaluate to TRUE (or UNKNOWN/NULL) for PostgreSQL to accept an INSERT or UPDATE.
      sql`${table.subtotalInPaise} >= 0
        AND ${table.deliveryFeeInPaise} >= 0
        AND ${table.taxInPaise} >= 0
        AND ${table.discountInPaise} >= 0`
    ),

    check(
      "food_orders_total_matches",
      sql`${table.amountInPaise} =
        ${table.subtotalInPaise}
        + ${table.deliveryFeeInPaise}
        + ${table.taxInPaise}
        - ${table.discountInPaise}`
    ),
  ]
)

// food order items table
export const foodOrderItems = pgTable(
  "food_order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    foodOrderId: uuid("food_order_id")
      .notNull()
      .references(() => foodOrders.id, { onDelete: "restrict" }),

    menuItemId: integer("menu_item_id").references(() => menuItems.id, {
      onDelete: "set null",
    }),

    itemName: text("item_name").notNull(), // copy of the menu item name at the time of order, in case the menu item is deleted or renamed later

    unitPriceInPaise: integer("unit_price_in_paise").notNull(), // copy of the menu item price at the time of order, in case the menu item price changes later

    quantity: integer("quantity").notNull(),
  },
  (table) => [
    index("food_order_items_order_idx").on(table.foodOrderId),

    check("food_order_items_quantity_positive", sql`${table.quantity} > 0`),

    check("food_order_items_price_check", sql`${table.unitPriceInPaise} >= 0`),
  ]
)

// payment attempts table for tracking payment attempts for each food order
export const paymentAttempts = pgTable(
  "payment_attempts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    foodOrderId: uuid("food_order_id")
      .notNull()
      .references(() => foodOrders.id, { onDelete: "restrict" }),

    razorpayPaymentId: text("razorpay_payment_id").notNull().unique(),

    status: paymentAttemptStatusEnum("payment_status").notNull(),

    amountInPaise: integer("amount_in_paise").notNull(),

    currency: text("currency").notNull(),

    failureReason: text("failure_reason"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("payment_attempts_order_idx").on(table.foodOrderId)]
)

// payment webhook so we don't process the same payment event multiple times
export const paymentWebhookEvents = pgTable("payment_webhook_events", {
  eventId: text("event_id").primaryKey(),

  eventType: text("event_type").notNull(),

  processedAt: timestamp("processed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
})
