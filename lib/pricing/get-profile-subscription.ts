import "server-only"
import { eq, sql } from "drizzle-orm"
import { db } from "../db/drizzle"
import { pricingTiers, profileSubscriptions } from "../db/schema/schema"

export async function getProfileSubscription(profileId: number) {
  const [subscription] = await db
    .select({
      profileId: profileSubscriptions.profileId,
      pricingTierId: pricingTiers.id,
      planName: pricingTiers.planName,
      staffLimitOverride: profileSubscriptions.staffLimit,
      staffLimit: sql<number>`coalesce(${profileSubscriptions.staffLimit}, ${pricingTiers.staffLimit})`,
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
