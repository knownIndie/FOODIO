import "server-only"
import { hash } from "argon2"
import { eq, or } from "drizzle-orm"
import { db } from "../db/drizzle"
import {
  pricingTiers,
  profileRoles,
  profileSubscriptions,
  profiles,
  roles,
} from "../db/schema/schema"

type RegisterRestaurantProfileInput = {
  username: string
  name: string
  email: string
  password: string
}

const freePricingTierId = 1
const restaurantOwnerRole = "RESTAURANT_OWNER"

export async function registerRestaurantProfile(
  input: RegisterRestaurantProfileInput
) {
  const email = input.email.trim().toLowerCase()
  const username = input.username.trim().toLowerCase()
  const name = input.name.trim()

  const [existingProfile] = await db
    .select({ email: profiles.email, username: profiles.username })
    .from(profiles)
    .where(or(eq(profiles.email, email), eq(profiles.username, username)))
    .limit(1)

  if (existingProfile) {
    throw new Error(
      existingProfile.email === email
        ? "EMAIL_ALREADY_EXISTS"
        : "USERNAME_ALREADY_EXISTS"
    )
  }

  const hashedPassword = await hash(input.password)

  return db.transaction(async (tx) => {
    const [role] = await tx
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.role, restaurantOwnerRole))
      .limit(1)

    if (!role) throw new Error("REGISTRATION_ROLE_NOT_SEEDED")

    const [pricingTier] = await tx
      .select()
      .from(pricingTiers)
      .where(eq(pricingTiers.id, freePricingTierId))
      .limit(1)

    if (!pricingTier) throw new Error("PRICING_TIER_NOT_SEEDED")

    const [profile] = await tx
      .insert(profiles)
      .values({ name, username, email, password: hashedPassword })
      .returning({
        id: profiles.id,
        name: profiles.name,
        username: profiles.username,
        email: profiles.email,
      })

    await tx.insert(profileRoles).values({
      profileId: profile.id,
      roleId: role.id,
    })

    await tx.insert(profileSubscriptions).values({
      profileId: profile.id,
      pricingTierId: pricingTier.id,
      staffLimit: pricingTier.staffLimit,
      restaurantLimit: pricingTier.restaurantLimit,
    })

    return profile
  })
}

export async function addRestaurantProfile(profileId: number) {
  return db.transaction(async (tx) => {
    const [role] = await tx
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.role, restaurantOwnerRole))
      .limit(1)

    if (!role) throw new Error("REGISTRATION_ROLE_NOT_SEEDED")

    const [pricingTier] = await tx
      .select()
      .from(pricingTiers)
      .where(eq(pricingTiers.id, freePricingTierId))
      .limit(1)

    if (!pricingTier) throw new Error("PRICING_TIER_NOT_SEEDED")

    await tx
      .insert(profileRoles)
      .values({ profileId, roleId: role.id })
      .onConflictDoNothing()

    await tx
      .insert(profileSubscriptions)
      .values({
        profileId,
        pricingTierId: pricingTier.id,
        staffLimit: pricingTier.staffLimit,
        restaurantLimit: pricingTier.restaurantLimit,
      })
      .onConflictDoNothing()
  })
}
