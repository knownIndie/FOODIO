import { writeFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import { hash } from "argon2"
import { and, eq, inArray, or, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { PLATFORM_ROLES } from "../../../lib/auth/schema/roles"
import * as schema from "../../../lib/db/schema/schema"
import { pricingTiersData } from "../../../lib/pricing/pricing-teirs"
import { ownerPassword, seeds, totalDishes } from "./1000-restaurants-data"

export async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL not set")
  // Salt each hash separately even though all owners share the same password.
  const passwordHashes: string[] = []
  // Bound Argon2 memory use while giving each owner a separate salt.
  for (let start = 0; start < seeds.length; start += 4) {
    passwordHashes.push(
      ...(await Promise.all(
        seeds.slice(start, start + 4).map(() => hash(ownerPassword))
      ))
    )
  }
  const db = drizzle(databaseUrl)
  try {
    await db.transaction(async (tx) => {
      await writeSeed(tx, passwordHashes)
    })
  } finally {
    await db.$client.end()
  }
  console.log(
    `Seed committed: ${seeds.length} verified owners, subscriptions and restaurants, with ${totalDishes} dishes.`
  )
}

// Shared by the Neon runner and the isolated PGlite integration check.
type SeedTransaction = Parameters<
  Parameters<ReturnType<typeof drizzle>["transaction"]>[0]
>[0]
export async function writeSeed(tx: SeedTransaction, passwordHashes: string[]) {
  if (passwordHashes.length !== seeds.length)
    throw new Error("Expected one password hash per owner.")
  // Prevent two copies of this script from inserting the same menus at once.
  await tx.execute(sql`SELECT pg_advisory_xact_lock(1000292026)`)
  await tx
    .insert(schema.roles)
    .values(PLATFORM_ROLES.map((role) => ({ role })))
    .onConflictDoNothing()
  await tx
    .insert(schema.pricingTiers)
    .values([...pricingTiersData])
    .onConflictDoNothing()
  const [tier] = await tx
    .select()
    .from(schema.pricingTiers)
    .where(eq(schema.pricingTiers.id, 1))
  if (!tier || tier.restaurantLimit < 1)
    throw new Error("Free tier must allow at least one restaurant.")
  const ownerRoles = await tx
    .select()
    .from(schema.roles)
    .where(inArray(schema.roles.role, ["CUSTOMER", "RESTAURANT_OWNER"]))
  if (ownerRoles.length !== 2)
    throw new Error("Required owner roles are missing.")

  for (const [index, seed] of seeds.entries()) {
    const matches = await tx
      .select()
      .from(schema.profiles)
      .where(
        or(
          eq(schema.profiles.email, seed.email),
          eq(schema.profiles.username, seed.username)
        )
      )
    if (
      matches.length > 1 ||
      matches.some(
        (profile) =>
          profile.email !== seed.email ||
          profile.username !== seed.username ||
          profile.name !== seed.ownerName
      )
    ) {
      throw new Error(
        `Account collision for ${seed.slug}; no records committed.`
      )
    }
    const [existingRestaurant] = await tx
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.id, seed.id))
    if (
      existingRestaurant &&
      (existingRestaurant.email !== seed.email ||
        existingRestaurant.name !== seed.name)
    ) {
      throw new Error(
        `Restaurant collision for ${seed.slug}; no records committed.`
      )
    }
    const profileValues = {
      name: seed.ownerName,
      username: seed.username,
      email: seed.email,
      password: passwordHashes[index],
      emailVerifiedAt: new Date(),
    }
    const [profile] = await tx
      .insert(schema.profiles)
      .values(profileValues)
      .onConflictDoUpdate({
        target: schema.profiles.email,
        set: profileValues,
      })
      .returning({ id: schema.profiles.id })
    await tx
      .insert(schema.profileRoles)
      .values(
        ownerRoles.map((role) => ({
          profileId: profile.id,
          roleId: role.id,
        }))
      )
      .onConflictDoNothing()
    const subscription = {
      pricingTierId: tier.id,
      restaurantLimit: tier.restaurantLimit,
      staffLimit: tier.staffLimit,
    }
    await tx
      .insert(schema.profileSubscriptions)
      .values({ profileId: profile.id, ...subscription })
      .onConflictDoUpdate({
        target: schema.profileSubscriptions.profileId,
        set: { ...subscription, updatedAt: new Date() },
      })
    const restaurantValues = {
      name: seed.name,
      phone: seed.phone,
      email: seed.email,
      address: seed.address,
      resmaplatitude: seed.latitude,
      resmaplongitude: seed.longitude,
      cuisineTypes: seed.cuisine,
      description: `Fictional demo restaurant serving regional dishes in ${seed.city}, ${seed.state}.`,
      status: "ACTIVE" as const,
    }
    await tx
      .insert(schema.restaurants)
      .values({ id: seed.id, ...restaurantValues })
      .onConflictDoUpdate({
        target: schema.restaurants.id,
        set: { ...restaurantValues, updatedAt: new Date() },
      })
    const memberships = await tx
      .select()
      .from(schema.restaurantMembers)
      .where(eq(schema.restaurantMembers.restaurantId, seed.id))
    if (
      memberships.some(
        (member) => member.profileId !== profile.id && member.role === "OWNER"
      )
    ) {
      throw new Error(
        `Unexpected owner for ${seed.slug}; no records committed.`
      )
    }
    await tx
      .insert(schema.restaurantMembers)
      .values({
        profileId: profile.id,
        restaurantId: seed.id,
        role: "OWNER",
      })
      .onConflictDoUpdate({
        target: [
          schema.restaurantMembers.restaurantId,
          schema.restaurantMembers.profileId,
        ],
        set: { role: "OWNER" },
      })
    const business = {
      legal_name: `${seed.name} Demo`,
      entity_type: "sole_proprietorship",
      registered_address: seed.address,
      owner_or_poc_name: seed.ownerName,
      owner_or_poc_phone: seed.phone,
    }
    await tx
      .insert(schema.restaurantBusinessDetails)
      .values({ restaurantId: seed.id, ...business })
      .onConflictDoUpdate({
        target: schema.restaurantBusinessDetails.restaurantId,
        set: { ...business, updatedAt: new Date() },
      })
    for (const type of ["FSSAI", "GST"] as const) {
      const registration_number = `DEMO-${type}-${seed.slug.toUpperCase()}`
      await tx
        .insert(schema.restaurantCompliances)
        .values({ restaurantId: seed.id, type, registration_number })
        .onConflictDoUpdate({
          target: [
            schema.restaurantCompliances.restaurantId,
            schema.restaurantCompliances.type,
          ],
          set: { registration_number, updatedAt: new Date() },
        })
    }
    const bank = {
      accountNumber: `DEMO-${seed.slug}`,
      bankName: "FoodIO Demo Bank",
      ifsc: "DEMO0000000",
    }
    await tx
      .insert(schema.restaurantBankAccounts)
      .values({ restaurantId: seed.id, ...bank })
      .onConflictDoUpdate({
        target: schema.restaurantBankAccounts.restaurantId,
        set: { ...bank, updatedAt: new Date() },
      })
    const existingItems = await tx
      .select({ id: schema.menuItems.id, name: schema.menuItems.name })
      .from(schema.menuItems)
      .where(eq(schema.menuItems.restaurantId, seed.id))
    if (
      new Set(existingItems.map((item) => item.name)).size !==
        existingItems.length ||
      existingItems.some(
        (item) => !seed.menu.some((dish) => dish.name === item.name)
      )
    ) {
      throw new Error(`Unexpected menu for ${seed.slug}; no records committed.`)
    }
    const newItems: (typeof schema.menuItems.$inferInsert)[] = []
    for (const item of seed.menu) {
      const { priceInRupees, ...details } = item
      const values = {
        ...details,
        restaurantId: seed.id,
        priceInPaise: Math.round(priceInRupees * 100),
      }
      const existing = existingItems.find((saved) => saved.name === item.name)
      if (existing) {
        await tx
          .update(schema.menuItems)
          .set({ ...values, updatedAt: new Date() })
          .where(
            and(
              eq(schema.menuItems.id, existing.id),
              eq(schema.menuItems.restaurantId, seed.id)
            )
          )
      } else {
        newItems.push(values)
      }
    }
    if (newItems.length) await tx.insert(schema.menuItems).values(newItems)
    const setup = {
      restaurantBasicStatus: "COMPLETED",
      restaurantBusinessDetailsStatus: "COMPLETED",
      restaurantCompliancesStatus: "COMPLETED",
      restaurantBankAccountsStatus: "COMPLETED",
      menuItemsStatus: "COMPLETED",
    } as const
    await tx
      .insert(schema.restaurantSetupStatus)
      .values({ restaurantId: seed.id, ...setup })
      .onConflictDoUpdate({
        target: schema.restaurantSetupStatus.restaurantId,
        set: setup,
      })
  }
  const savedItems = await tx
    .select({ id: schema.menuItems.id })
    .from(schema.menuItems)
    .where(
      inArray(
        schema.menuItems.restaurantId,
        seeds.map((seed) => seed.id)
      )
    )
  if (savedItems.length !== totalDishes)
    throw new Error(
      `Expected ${totalDishes} dishes, found ${savedItems.length}.`
    )
}

async function main() {
  const args = process.argv.slice(2)
  if (args.some((arg) => arg !== "--write") || args.length > 1) {
    throw new Error(
      "Supported argument: --write. Omit it to generate a preview."
    )
  }
  if (args.includes("--write")) {
    await seedDatabase()
  } else {
    await writeFile(
      new URL("./1000-restaurants-preview.json", import.meta.url),
      `${JSON.stringify(
        {
          summary: {
            restaurants: seeds.length,
            owners: seeds.length,
            dishes: totalDishes,
            password: ownerPassword,
          },
          restaurants: seeds,
        },
        null,
        2
      )}\n`
    )
    console.log(
      `Preview saved: ${seeds.length} restaurants, ${totalDishes} dishes. No database connection made.`
    )
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await main()
