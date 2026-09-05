import { hash } from "argon2"
import { eq, inArray, or } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { PLATFORM_ROLES } from "../auth/schema/roles"
import {
  menuItems,
  pricingTiers,
  profileRoles,
  profileSubscriptions,
  profiles,
  restaurantBankAccounts,
  restaurantBusinessDetails,
  restaurantCompliances,
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
  roles,
} from "../db/schema/schema"
import { pricingTiersData } from "../pricing/pricing-teirs"
import {
  FOODIO_KITCHEN_RESTAURANT_ID,
  foodioKitchenMenuItems,
  foodioKitchenRestaurant,
  foodioStudiosDemoProfile,
} from "./foodio-kitchen"

function databaseUrl() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error("DATABASE_URL not set")
  return connectionString
}

const db = drizzle(databaseUrl())

await db
  .insert(roles)
  .values(
    PLATFORM_ROLES.map((role) => ({
      role,
    }))
  )
  .onConflictDoNothing({ target: roles.role })

await db
  .insert(pricingTiers)
  .values([...pricingTiersData])
  .onConflictDoNothing({ target: pricingTiers.id })

const passwordHash = await hash(foodioStudiosDemoProfile.password)

await db.transaction(async (tx) => {
  const [existingProfile] = await tx
    .select({ id: profiles.id })
    .from(profiles)
    .where(
      or(
        eq(profiles.email, foodioStudiosDemoProfile.email),
        eq(profiles.username, foodioStudiosDemoProfile.username)
      )
    )
    .limit(1)

  const [profile] = existingProfile
    ? await tx
        .update(profiles)
        .set({
          email: foodioStudiosDemoProfile.email,
          emailVerifiedAt: new Date(),
          name: foodioStudiosDemoProfile.name,
          password: passwordHash,
          username: foodioStudiosDemoProfile.username,
        })
        .where(eq(profiles.id, existingProfile.id))
        .returning({ id: profiles.id })
    : await tx
        .insert(profiles)
        .values({
          email: foodioStudiosDemoProfile.email,
          emailVerifiedAt: new Date(),
          name: foodioStudiosDemoProfile.name,
          password: passwordHash,
          username: foodioStudiosDemoProfile.username,
        })
        .returning({ id: profiles.id })

  if (!profile) throw new Error("DEMO_PROFILE_CREATE_FAILED")

  const demoRoles = await tx
    .select({ id: roles.id, role: roles.role })
    .from(roles)
    .where(inArray(roles.role, ["CUSTOMER", "RESTAURANT_OWNER"]))

  if (demoRoles.length !== 2) throw new Error("DEMO_ROLES_NOT_SEEDED")

  await tx
    .insert(profileRoles)
    .values(
      demoRoles.map((role) => ({
        profileId: profile.id,
        roleId: role.id,
      }))
    )
    .onConflictDoNothing()

  const [freeTier] = await tx
    .select()
    .from(pricingTiers)
    .where(eq(pricingTiers.id, 1))
    .limit(1)

  if (!freeTier) throw new Error("DEMO_PRICING_TIER_NOT_SEEDED")

  await tx
    .insert(profileSubscriptions)
    .values({
      profileId: profile.id,
      pricingTierId: freeTier.id,
      staffLimit: freeTier.staffLimit,
      restaurantLimit: freeTier.restaurantLimit,
    })
    .onConflictDoNothing()

  await tx
    .insert(restaurants)
    .values({
      id: FOODIO_KITCHEN_RESTAURANT_ID,
      ...foodioKitchenRestaurant,
    })
    .onConflictDoUpdate({
      target: restaurants.id,
      set: {
        ...foodioKitchenRestaurant,
        updatedAt: new Date(),
      },
    })

  await tx
    .insert(restaurantMembers)
    .values({
      restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
      profileId: profile.id,
      role: "OWNER",
    })
    .onConflictDoNothing()

  await tx
    .insert(restaurantBusinessDetails)
    .values({
      restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
      legal_name: "FoodIO Studios Demo",
      entity_type: "private_limited",
      registered_address: "FoodIO Studios, Bengaluru, Karnataka, India",
      owner_or_poc_name: foodioStudiosDemoProfile.name,
      owner_or_poc_phone: foodioKitchenRestaurant.phone,
    })
    .onConflictDoNothing()

  await tx
    .insert(restaurantCompliances)
    .values([
      {
        restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
        type: "FSSAI",
        registration_number: "FSSAI-DEMO-FOODIO",
      },
      {
        restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
        type: "GST",
        registration_number: "GST-DEMO-FOODIO",
      },
    ])
    .onConflictDoNothing()

  await tx
    .insert(restaurantBankAccounts)
    .values({
      restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
      accountNumber: "000000000001",
      bankName: "FoodIO Demo Bank",
      ifsc: "DEMO0000001",
    })
    .onConflictDoNothing()

  await tx
    .insert(restaurantSetupStatus)
    .values({
      restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
      restaurantBasicStatus: "COMPLETED",
      restaurantBusinessDetailsStatus: "COMPLETED",
      restaurantCompliancesStatus: "COMPLETED",
      restaurantBankAccountsStatus: "COMPLETED",
      menuItemsStatus: "COMPLETED",
    })
    .onConflictDoUpdate({
      target: restaurantSetupStatus.restaurantId,
      set: {
        restaurantBasicStatus: "COMPLETED",
        restaurantBusinessDetailsStatus: "COMPLETED",
        restaurantCompliancesStatus: "COMPLETED",
        restaurantBankAccountsStatus: "COMPLETED",
        menuItemsStatus: "COMPLETED",
      },
    })

  const [existingMenuItem] = await tx
    .select({ id: menuItems.id })
    .from(menuItems)
    .where(eq(menuItems.restaurantId, FOODIO_KITCHEN_RESTAURANT_ID))
    .limit(1)

  if (!existingMenuItem) {
    await tx.insert(menuItems).values(
      foodioKitchenMenuItems.map((item) => ({
        restaurantId: FOODIO_KITCHEN_RESTAURANT_ID,
        ...item,
        foodTypes: [...item.foodTypes],
        cuisines: [...item.cuisines],
        timings: [...item.timings],
      }))
    )
  }
})

console.log("FoodIO Kitchen demo data seeded successfully")
