import "server-only"

import { and, eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { cache } from "react"
import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import {
  restaurantBankAccounts,
  restaurantBusinessDetails,
  restaurantCompliances,
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
} from "@/lib/db/schema/schema"
import { getRestaurantSetupProgress } from "./restaurant-extra"
import { restaurantIdSchema } from "./schema/restaurant-schema"

export const getCurrentRestaurant = cache(async (restaurantId: string) => {
  const parsedRestaurantId = restaurantIdSchema.safeParse(restaurantId)
  if (!parsedRestaurantId.success) notFound()

  const profile = await currentProfile()
  if (!profile)
    redirect(`/login?returnTo=/dashboard/restaurants/${restaurantId}`)

  const [restaurant] = await db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      description: restaurants.description,
      phone: restaurants.phone,
      email: restaurants.email,
      address: restaurants.address,
      latitude: restaurants.resmaplatitude,
      longitude: restaurants.resmaplongitude,
      status: restaurants.status,
      membershipRole: restaurantMembers.role,
      basicStatus: restaurantSetupStatus.restaurantBasicStatus,
      businessStatus: restaurantSetupStatus.restaurantBusinessDetailsStatus,
      complianceStatus: restaurantSetupStatus.restaurantCompliancesStatus,
      bankStatus: restaurantSetupStatus.restaurantBankAccountsStatus,
      menuStatus: restaurantSetupStatus.menuItemsStatus,
    })
    .from(restaurants)
    .innerJoin(
      restaurantMembers,
      eq(restaurantMembers.restaurantId, restaurants.id)
    )
    .innerJoin(
      restaurantSetupStatus,
      eq(restaurantSetupStatus.restaurantId, restaurants.id)
    )
    .where(
      and(
        eq(restaurants.id, parsedRestaurantId.data),
        eq(restaurantMembers.profileId, profile.id),
        eq(restaurantMembers.role, "OWNER")
      )
    )
    .limit(1)

  if (!restaurant) notFound()

  const [businessRows, compliance, bankRows] = await Promise.all([
    db
      .select({
        legalName: restaurantBusinessDetails.legal_name,
        entityType: restaurantBusinessDetails.entity_type,
        registeredAddress: restaurantBusinessDetails.registered_address,
        ownerOrPocName: restaurantBusinessDetails.owner_or_poc_name,
        ownerOrPocPhone: restaurantBusinessDetails.owner_or_poc_phone,
      })
      .from(restaurantBusinessDetails)
      .where(eq(restaurantBusinessDetails.restaurantId, restaurant.id))
      .limit(1),
    db
      .select({
        type: restaurantCompliances.type,
        registrationNumber: restaurantCompliances.registration_number,
      })
      .from(restaurantCompliances)
      .where(eq(restaurantCompliances.restaurantId, restaurant.id)),
    db
      .select({
        bankName: restaurantBankAccounts.bankName,
        accountNumber: restaurantBankAccounts.accountNumber,
        ifsc: restaurantBankAccounts.ifsc,
      })
      .from(restaurantBankAccounts)
      .where(eq(restaurantBankAccounts.restaurantId, restaurant.id))
      .limit(1),
  ])

  const setup = {
    basic: restaurant.basicStatus,
    business: restaurant.businessStatus,
    compliance: restaurant.complianceStatus,
    bank: restaurant.bankStatus,
    menu: restaurant.menuStatus,
  }

  return {
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      phone: restaurant.phone,
      email: restaurant.email,
      address: restaurant.address,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      status: restaurant.status,
      membershipRole: restaurant.membershipRole,
    },
    setup,
    progress: getRestaurantSetupProgress(setup),
    business: businessRows[0] ?? null,
    compliance,
    bank: bankRows[0] ?? null,
  }
})
