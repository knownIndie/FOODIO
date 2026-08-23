import { and, eq } from "drizzle-orm"
import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import {
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
} from "@/lib/db/schema/schema"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"

type RouteContext = { params: Promise<{ restaurantId: string }> }

export async function POST(_request: Request, { params }: RouteContext) {
  const profile = await currentProfile()
  if (!profile) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }
  if (!profile.roles.includes("RESTAURANT_OWNER")) {
    return Response.json(
      { error: "Restaurant owner access is required." },
      { status: 403 }
    )
  }

  const { restaurantId } = await params
  const parsedRestaurantId = restaurantIdSchema.safeParse(restaurantId)
  if (!parsedRestaurantId.success) {
    return Response.json({ error: "Invalid restaurant ID." }, { status: 400 })
  }

  try {
    await db.transaction(async (tx) => {
      const [restaurant] = await tx
        .select({
          status: restaurants.status,
          basicStatus: restaurantSetupStatus.restaurantBasicStatus,
          businessStatus: restaurantSetupStatus.restaurantBusinessDetailsStatus,
          complianceStatus: restaurantSetupStatus.restaurantCompliancesStatus,
          bankStatus: restaurantSetupStatus.restaurantBankAccountsStatus,
        })
        .from(restaurants)
        .innerJoin(
          restaurantSetupStatus,
          eq(restaurantSetupStatus.restaurantId, restaurants.id)
        )
        .where(eq(restaurants.id, parsedRestaurantId.data))
        .limit(1)

      if (!restaurant) throw new Error("RESTAURANT_NOT_FOUND")

      const [membership] = await tx
        .select({ role: restaurantMembers.role })
        .from(restaurantMembers)
        .where(
          and(
            eq(restaurantMembers.restaurantId, parsedRestaurantId.data),
            eq(restaurantMembers.profileId, profile.id),
            eq(restaurantMembers.role, "OWNER")
          )
        )
        .limit(1)

      if (!membership) throw new Error("RESTAURANT_ACCESS_DENIED")
      if (restaurant.status !== "DRAFT") {
        throw new Error("RESTAURANT_ONBOARDING_CLOSED")
      }

      const requiredStatuses = [
        restaurant.basicStatus,
        restaurant.businessStatus,
        restaurant.complianceStatus,
        restaurant.bankStatus,
      ]
      if (requiredStatuses.some((status) => status !== "COMPLETED")) {
        throw new Error("RESTAURANT_SETUP_INCOMPLETE")
      }

      await tx
        .update(restaurants)
        .set({ status: "PENDING_REVIEW", updatedAt: new Date() })
        .where(eq(restaurants.id, parsedRestaurantId.data))
    })

    return Response.json({
      success: true,
      next: `/dashboard/restaurants/${parsedRestaurantId.data}`,
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "RESTAURANT_NOT_FOUND") {
        return Response.json(
          { error: "Restaurant not found." },
          { status: 404 }
        )
      }
      if (error.message === "RESTAURANT_ACCESS_DENIED") {
        return Response.json({ error: "Access denied." }, { status: 403 })
      }
      if (
        error.message === "RESTAURANT_ONBOARDING_CLOSED" ||
        error.message === "RESTAURANT_SETUP_INCOMPLETE"
      ) {
        return Response.json(
          { error: "Complete every required section before submitting." },
          { status: 409 }
        )
      }
    }

    console.error("Restaurant submission failed.", error)
    return Response.json(
      { error: "Could not submit the restaurant." },
      { status: 500 }
    )
  }
}
