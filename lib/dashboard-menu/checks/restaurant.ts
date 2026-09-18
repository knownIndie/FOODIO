import "server-only"

import { and, eq } from "drizzle-orm"
import type { NeonTransaction } from "drizzle-orm/neon-serverless"
import type { EmptyRelations } from "drizzle-orm/relations"
import { restaurantMembers } from "@/lib/db/schema/schema"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"
import { MenuCheckError } from "./error"

export function checkRestaurantId(restaurantId: string) {
  // Reject IDs that are not UUIDs.
  const parsed = restaurantIdSchema.safeParse(restaurantId)
  if (!parsed.success) {
    throw new MenuCheckError(400, "Invalid restaurant ID.")
  }
  return parsed.data
}

export async function requireRestaurantOwner(
  transaction: NeonTransaction<EmptyRelations>,
  profileId: number,
  restaurantId: string
) {
  // Find this user's OWNER membership for this restaurant.
  const [ownerMembership] = await transaction
    .select({ role: restaurantMembers.role })
    .from(restaurantMembers)
    .where(
      and(
        eq(restaurantMembers.profileId, profileId),
        eq(restaurantMembers.restaurantId, restaurantId),
        eq(restaurantMembers.role, "OWNER")
      )
    )
    // Keep ownership unchanged until the menu save finishes.
    .for("share")

  if (!ownerMembership) {
    throw new MenuCheckError(404, "Restaurant not found.")
  }
}

/*
and() means all checks must pass: it must be your account, the restaurant you’re changing, and you must be its owner.
.for("share") means don’t change this ownership record while the menu is saving.
Think of it like this: check you have permission, keep that permission unchanged during the save, then release the lock.
This stops you from changing someone else’s menu and handles ownership changes happening at the same time.
*/
