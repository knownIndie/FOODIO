import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import {
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
} from "@/lib/db/schema/schema"
import { restaurantFirstSetupSchema } from "@/lib/restaurants/restaurant-basic-schema"

export async function POST(request: Request) {
  const profile = await currentProfile()
  if (!profile) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!profile.emailVerifiedAt) {
    return Response.json(
      { error: "Verify your email before creating a restaurant." },
      { status: 403 }
    )
  }

  if (!profile.roles.includes("RESTAURANT_OWNER")) {
    return Response.json(
      { error: "Restaurant owner access is required." },
      { status: 403 }
    )
  }

  // `unknown` forces schema validation
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const parsed = restaurantFirstSetupSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      {
        error: "Invalid restaurant details",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  try {
    const restaurant = await db.transaction(async (tx) => {
      const [restaurantData] = await tx
        .insert(restaurants)
        .values({
          name: parsed.data.name,
          description: parsed.data.description,
        })
        .returning({
          id: restaurants.id,
          name: restaurants.name,
          description: restaurants.description,
        })

      if (!restaurantData) {
        throw new Error(
          "Restaurant insert returned no row, we could not create the restaurant."
        )
      }

      await tx.insert(restaurantMembers).values({
        profileId: profile.id,
        restaurantId: restaurantData.id,
        role: "OWNER",
      })
      await tx.insert(restaurantSetupStatus).values({
        restaurantId: restaurantData.id,
        restaurantBasicStatus: "IN_PROGRESS",
      })
      return restaurantData
    })

    return Response.json(
      {
        restaurant,
        next: "/dashboard",
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create the restaurant draft", error)
    return Response.json(
      { error: "Failed to create the restaurant draft" },
      { status: 500 }
    )
  }
}
