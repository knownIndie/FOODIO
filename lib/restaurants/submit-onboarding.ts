import "server-only"

import { and, count, eq } from "drizzle-orm"
import { db } from "@/lib/db/drizzle"
import {
  profileSubscriptions,
  profiles,
  restaurantBankAccounts,
  restaurantBusinessDetails,
  restaurantCompliances,
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
} from "@/lib/db/schema/schema"
import type { RestaurantOnboardingInput } from "./schema/restaurant-schema"

export class OnboardingError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

export async function submitOnboarding(
  profileId: number,
  input: RestaurantOnboardingInput,
  restaurantId?: string
) {
  return db.transaction(async (tx) => {
    // Serialize applications from the same owner before checking their quota.
    await tx
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .for("update")

    let id = restaurantId
    if (id) {
      const [membership] = await tx
        .select({ role: restaurantMembers.role })
        .from(restaurantMembers)
        .where(
          and(
            eq(restaurantMembers.restaurantId, id),
            eq(restaurantMembers.profileId, profileId),
            eq(restaurantMembers.role, "OWNER")
          )
        )
      if (!membership) throw new OnboardingError("Restaurant not found.", 404)
      const [restaurant] = await tx
        .select({ status: restaurants.status })
        .from(restaurants)
        .where(eq(restaurants.id, id))
        .for("update")
      if (restaurant?.status !== "DRAFT") {
        throw new OnboardingError(
          "This restaurant has already been submitted or is no longer editable.",
          409
        )
      }
    } else {
      const [subscription] = await tx
        .select()
        .from(profileSubscriptions)
        .where(eq(profileSubscriptions.profileId, profileId))
        .for("update")
      const [owned] = await tx
        .select({ total: count() })
        .from(restaurantMembers)
        .where(
          and(
            eq(restaurantMembers.profileId, profileId),
            eq(restaurantMembers.role, "OWNER")
          )
        )
      if (!subscription || owned.total >= subscription.restaurantLimit) {
        throw new OnboardingError(
          "You have reached the restaurant limit for your subscription.",
          403
        )
      }
      const [restaurant] = await tx
        .insert(restaurants)
        .values({ name: input.name })
        .returning({ id: restaurants.id })
      id = restaurant.id
      await tx
        .insert(restaurantMembers)
        .values({ restaurantId: id, profileId, role: "OWNER" })
    }

    await tx
      .update(restaurants)
      .set({
        name: input.name,
        description: input.description || null,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        resmaplatitude: Number(input.latitude),
        resmaplongitude: Number(input.longitude),
        status: "PENDING_REVIEW",
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, id))

    const business = {
      legal_name: input.legalName,
      entity_type: input.entityType,
      registered_address: input.registeredAddress,
      owner_or_poc_name: input.ownerOrPocName,
      owner_or_poc_phone: input.ownerOrPocPhone,
      updatedAt: new Date(),
    }
    await tx
      .insert(restaurantBusinessDetails)
      .values({ restaurantId: id, ...business })
      .onConflictDoUpdate({
        target: restaurantBusinessDetails.restaurantId,
        set: business,
      })
    const bank = {
      bankName: input.bankName,
      accountNumber: input.accountNumber,
      ifsc: input.ifsc.toUpperCase(),
      updatedAt: new Date(),
    }
    await tx
      .insert(restaurantBankAccounts)
      .values({ restaurantId: id, ...bank })
      .onConflictDoUpdate({
        target: restaurantBankAccounts.restaurantId,
        set: bank,
      })

    await tx
      .delete(restaurantCompliances)
      .where(eq(restaurantCompliances.restaurantId, id))
    const registrations: Array<{
      type: "FSSAI" | "GST" | "TRADE_LICENSE"
      registration_number: string
    }> = [
      { type: "FSSAI", registration_number: input.fssaiRegistrationNumber },
      { type: "GST", registration_number: input.gstRegistrationNumber },
      { type: "TRADE_LICENSE", registration_number: input.tradeLicenseNumber },
    ]
    await tx
      .insert(restaurantCompliances)
      .values(
        registrations
          .filter((item) => item.registration_number)
          .map((item) => ({ restaurantId: id, ...item }))
      )
    const completed = {
      restaurantBasicStatus: "COMPLETED" as const,
      restaurantBusinessDetailsStatus: "COMPLETED" as const,
      restaurantCompliancesStatus: "COMPLETED" as const,
      restaurantBankAccountsStatus: "COMPLETED" as const,
    }
    await tx
      .insert(restaurantSetupStatus)
      .values({ restaurantId: id, ...completed })
      .onConflictDoUpdate({
        target: restaurantSetupStatus.restaurantId,
        set: completed,
      })
    return { id, status: "PENDING_REVIEW" as const }
  })
}
