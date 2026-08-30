import { drizzle } from "drizzle-orm/node-postgres"
import { pricingTiers } from "../db/schema/schema"
import { pricingTiersData } from "./pricing-teirs"
import { DatabaseUrl } from "../usefulFuncs"

// still need to run this
// pnpm exec tsx --env-file=.env lib/pricing/seed.ts

const conectionString = DatabaseUrl()

const db = drizzle(conectionString)

await db
  .insert(pricingTiers)
  .values(
    pricingTiersData.map((teir) => ({
      id: teir.id,
      planName: teir.planName,
      planPrice: teir.planPrice,
      restaurantLimit: teir.restaurantLimit,
      staffLimit: teir.staffLimit,
    }))
  )
  .onConflictDoNothing({ target: pricingTiers.id })
// If a row with the same id already exists, skip it instead of throwing an error.
