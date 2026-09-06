import { drizzle } from "drizzle-orm/node-postgres"
import { pricingTiers } from "../db/schema/schema"
import { DatabaseUrl } from "../usefulFuncs"
import { pricingTiersData } from "./pricing-teirs"

// pricing seed

// seeding command -> pnpm exec tsx --env-file=.env lib/pricing/seed.ts

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
