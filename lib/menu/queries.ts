import "server-only"

import { and, asc, eq } from "drizzle-orm"
import { db } from "@/lib/db/drizzle"
import {
  menuItems,
  restaurantMembers,
  restaurants,
} from "@/lib/db/schema/schema"

export async function getMenuForOwner(profileId: number, restaurantId: string) {
  const [restaurant] = await db
    .select({ id: restaurants.id, name: restaurants.name })
    .from(restaurants)
    .innerJoin(
      restaurantMembers,
      eq(restaurantMembers.restaurantId, restaurants.id)
    )
    .where(
      and(
        eq(restaurants.id, restaurantId),
        eq(restaurantMembers.profileId, profileId),
        eq(restaurantMembers.role, "OWNER")
      )
    )
    .limit(1)

  if (!restaurant) return null

  const items = await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      priceInPaise: menuItems.priceInPaise,
      isVeg: menuItems.isVeg,
      isActive: menuItems.isActive,
      isAvailable: menuItems.isAvailable,
    })
    .from(menuItems)
    .where(eq(menuItems.restaurantId, restaurant.id))
    .orderBy(asc(menuItems.id))

  return { restaurant, items }
}
