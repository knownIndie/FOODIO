import "server-only"
import { eq } from "drizzle-orm"
import { db } from "../db/drizzle"
import { pricingTiers, profileSubscriptions } from "../db/schema/schema"

export async function getProfileSubscription(profileId: number) {
  const [subscription] = await db
    .select({
      profileId: profileSubscriptions.profileId,
      pricingTierId: pricingTiers.id,
      planName: pricingTiers.planName,
      staffLimit: profileSubscriptions.staffLimit,
      restaurantLimit: profileSubscriptions.restaurantLimit,
    })
    .from(profileSubscriptions)
    .innerJoin(
      pricingTiers,
      eq(profileSubscriptions.pricingTierId, pricingTiers.id)
    )
    .where(eq(profileSubscriptions.profileId, profileId))
    .limit(1)

  return subscription ?? null
}
