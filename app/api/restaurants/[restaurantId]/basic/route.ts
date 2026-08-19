import { and, eq } from "drizzle-orm"
import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import {
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
} from "@/lib/db/schema/schema"
import {
  restaurantBasicSchema,
  restaurantIdSchema,
} from "@/lib/restaurants/schema/restaurant-schema"

type RouteContext = { params: Promise<{ restaurantId: string }> }

export async function PATCH(request: Request, { params }: RouteContext) {
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
  const parsed = restaurantBasicSchema.safeParse(
    await request.json().catch(() => null)
  )

  if (!parsedRestaurantId.success || !parsed.success) {
    return Response.json(
      {
        error: "Check the Basic details and try again.",
        fieldErrors: parsed.success
          ? undefined
          : parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  try {
    await db.transaction(async (tx) => {
      const [restaurant] = await tx
        .select({
          status: restaurants.status,
          basicStatus: restaurantSetupStatus.restaurantBasicStatus,
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
      if (restaurant.basicStatus !== "IN_PROGRESS") {
        throw new Error("SECTION_LOCKED")
      }

      await tx
        .update(restaurants)
        .set({
          phone: parsed.data.phone,
          email: parsed.data.email || null,
          address: parsed.data.address,
          resmaplatitude: Number(parsed.data.latitude),
          resmaplongitude: Number(parsed.data.longitude),
          updatedAt: new Date(),
        })
        .where(eq(restaurants.id, parsedRestaurantId.data))

      await tx
        .update(restaurantSetupStatus)
        .set({
          restaurantBasicStatus: "COMPLETED",
          restaurantBusinessDetailsStatus: "IN_PROGRESS",
        })
        .where(eq(restaurantSetupStatus.restaurantId, parsedRestaurantId.data))
    })

    return Response.json({
      success: true,
      next: `/dashboard/restaurants/${parsedRestaurantId.data}/setup/business`,
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
        error.message === "SECTION_LOCKED"
      ) {
        return Response.json(
          { error: "This onboarding section is locked." },
          { status: 409 }
        )
      }
    }

    console.error("Basic restaurant setup failed.", error)
    return Response.json(
      { error: "Could not save the Basic details." },
      { status: 500 }
    )
  }
}
