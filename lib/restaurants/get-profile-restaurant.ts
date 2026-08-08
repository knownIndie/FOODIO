import { eq } from "drizzle-orm"
import "server-only"
import { db } from "@/lib/db/drizzle"
import { restaurantMembers, restaurants } from "@/lib/db/schema/schema"

export async function getProfileRestaurant(profileId: number) {
  const [restaurant] = await db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      status: restaurants.status,
      membershipRole: restaurantMembers.role,
    })
    .from(restaurantMembers)
    .innerJoin(restaurants, eq(restaurantMembers.restaurantId, restaurants.id))
    .where(eq(restaurantMembers.profileId, profileId))
    .limit(1)

  return restaurant ?? null
}
