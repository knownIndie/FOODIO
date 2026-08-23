import { eq } from "drizzle-orm"
import { db } from "@/lib/db/drizzle"
import {
  restaurantBankAccounts,
  restaurantBusinessDetails,
  restaurantCompliances,
  restaurants,
} from "@/lib/db/schema/schema"

export async function getApprovalRestaurants() {
  return db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      status: restaurants.status,
    })
    .from(restaurants)
    .where(eq(restaurants.status, "PENDING_REVIEW"))
}

export async function getApprovalRestaurant(restaurantId: string) {
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
      cuisineTypes: restaurants.cuisineTypes,
      status: restaurants.status,
      business: {
        legalName: restaurantBusinessDetails.legal_name,
        entityType: restaurantBusinessDetails.entity_type,
        registeredAddress: restaurantBusinessDetails.registered_address,
        ownerOrPocName: restaurantBusinessDetails.owner_or_poc_name,
        ownerOrPocPhone: restaurantBusinessDetails.owner_or_poc_phone,
      },
      bank: {
        accountNumber: restaurantBankAccounts.accountNumber,
        bankName: restaurantBankAccounts.bankName,
        ifsc: restaurantBankAccounts.ifsc,
      },
    })
    .from(restaurants)
    .leftJoin(
      restaurantBusinessDetails,
      eq(restaurantBusinessDetails.restaurantId, restaurants.id)
    )
    .leftJoin(
      restaurantBankAccounts,
      eq(restaurantBankAccounts.restaurantId, restaurants.id)
    )
    .where(eq(restaurants.id, restaurantId))
    .limit(1)

  if (!restaurant) return null

  const compliance = await db
    .select({
      type: restaurantCompliances.type,
      registrationNumber: restaurantCompliances.registration_number,
    })
    .from(restaurantCompliances)
    .where(eq(restaurantCompliances.restaurantId, restaurantId))

  return { ...restaurant, compliance }
}
