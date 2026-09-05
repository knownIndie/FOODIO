import "server-only"

import { and, asc, eq } from "drizzle-orm"
import { db } from "@/lib/db/drizzle"
import { menuItems, restaurants } from "@/lib/db/schema/schema"
import { FOODIO_KITCHEN_RESTAURANT_ID } from "./foodio-kitchen"

export async function getDemoHomeData() {
  const [restaurant] = await db
    .select()
    .from(restaurants)
    .where(eq(restaurants.id, FOODIO_KITCHEN_RESTAURANT_ID))
    .limit(1)

  if (!restaurant) return null

  const items = await db
    .select()
    .from(menuItems)
    .where(
      and(
        eq(menuItems.restaurantId, restaurant.id),
        eq(menuItems.isActive, true),
        eq(menuItems.isAvailable, true)
      )
    )
    .orderBy(asc(menuItems.id))

  return { restaurant, items }
}
