import { eq, and } from "drizzle-orm"
import "server-only"
import { db } from "@/lib/db/drizzle"
import { restaurantMembers, restaurants } from "@/lib/db/schema/schema"
import { currentProfile } from "../auth/current-profile"
import { redirect } from "next/navigation"

export async function getProfileRestaurants(profileId: number) {
  const currentuser = await currentProfile()
  if (!currentuser) {
    redirect("/login")
  }
  if (currentuser.id !== profileId) {
    redirect("/login")
  }
  const restaurantList = await db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      status: restaurants.status,
      membershipRole: restaurantMembers.role,
    })
    .from(restaurantMembers)
    .innerJoin(restaurants, eq(restaurantMembers.restaurantId, restaurants.id))
    .where(
      and(
        eq(restaurantMembers.profileId, profileId),
        eq(restaurantMembers.role, "OWNER")
      )
    )

  return restaurantList
}
