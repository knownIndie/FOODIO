import { eq } from "drizzle-orm"
import { db } from "../db/drizzle"
import { restaurantMembers } from "../db/schema/schema"

export async function getRestaurantOwnerProfile(restaurantId: number) {
  const [ownerProfile] = await db
    .select({
      restaurantId: restaurantMembers.restaurantId,
      profileId: restaurantMembers.profileId,
      role: restaurantMembers.role,
    })
    .from(restaurantMembers)

    .where(eq(restaurantMembers.restaurantId, restaurantId))
    .limit(1)
  return ownerProfile
}
