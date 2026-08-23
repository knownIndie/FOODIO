import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import { restaurants } from "@/lib/db/schema/schema"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"

const approvalActionSchema = z.object({
  action: z.enum(["approve", "reject"]),
})

type RouteContext = { params: Promise<{ restaurantId: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const profile = await currentProfile()
  if (!profile) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (!profile.roles.includes("ADMIN")) {
    return Response.json(
      { error: "Admin access is required." },
      { status: 403 }
    )
  }

  const { restaurantId } = await params
  const parsedRestaurantId = restaurantIdSchema.safeParse(restaurantId)

  if (!parsedRestaurantId.success) {
    return Response.json({ error: "Invalid restaurant ID." }, { status: 400 })
  }

  const parsedBody = approvalActionSchema.safeParse(
    await request.json().catch(() => null)
  )
  if (!parsedBody.success) {
    return Response.json(
      { error: "Action must be approve or reject." },
      { status: 400 }
    )
  }

  const nextStatus =
    parsedBody.data.action === "approve" ? "ACTIVE" : "REJECTED"

  try {
    const [updatedRestaurant] = await db
      .update(restaurants)
      .set({ status: nextStatus, updatedAt: new Date() })
      .where(
        and(
          eq(restaurants.id, parsedRestaurantId.data),
          eq(restaurants.status, "PENDING_REVIEW")
        )
      )
      .returning({ id: restaurants.id, status: restaurants.status })

    if (!updatedRestaurant) {
      const [restaurant] = await db
        .select({ id: restaurants.id, status: restaurants.status })
        .from(restaurants)
        .where(eq(restaurants.id, parsedRestaurantId.data))
        .limit(1)

      if (!restaurant) {
        return Response.json(
          { error: "Restaurant not found." },
          { status: 404 }
        )
      }

      return Response.json(
        { error: "Restaurant is no longer waiting for review." },
        { status: 409 }
      )
    }

    return Response.json({
      success: true,
      restaurant: updatedRestaurant,
      next: "/dashboard/admin",
    })
  } catch (error) {
    console.error("Restaurant approval update failed.", error)
    return Response.json(
      { error: "Could not update the restaurant status." },
      { status: 500 }
    )
  }
}
