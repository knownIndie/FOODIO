import "server-only"

import { db } from "@/lib/db/drizzle"
import { menuItems, restaurantSetupStatus } from "@/lib/db/schema/schema"
import { requireRestaurantOwner } from "./checks/restaurant"
import type { MenuBatchInput } from "./schema"

export async function addMenuItems(
  profileId: number,
  restaurantId: string,
  input: MenuBatchInput
) {
  return db.transaction(async (transaction) => {
    // An account owner role alone does not grant access to this restaurant.
    await requireRestaurantOwner(transaction, profileId, restaurantId)

    const created = await transaction
      .insert(menuItems)
      .values(
        // List supported columns explicitly instead of copying the request object.
        input.menuItems.map((item) => ({
          restaurantId,
          name: item.name,
          description: item.description || null,
          // The schema already checked decimal precision before this conversion.
          priceInPaise: Math.round(item.priceInRupees * 100),
          isVeg: item.isVeg,
          isAvailable: item.isAvailable,
          isActive: item.isActive,
          foodTypes: item.foodTypes,
          cuisines: item.cuisines,
          timings: item.timings,
          caloriesKcal: item.caloriesKcal,
        }))
      )
      .returning({ id: menuItems.id })

    // Save progress with the dishes. If either write fails, both roll back.
    await transaction
      .insert(restaurantSetupStatus)
      .values({ restaurantId, menuItemsStatus: "COMPLETED" })
      .onConflictDoUpdate({
        target: restaurantSetupStatus.restaurantId,
        set: { menuItemsStatus: "COMPLETED" },
      })

    return created.length
  })
}
