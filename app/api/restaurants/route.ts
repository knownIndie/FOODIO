import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import {
  restaurantMembers,
  restaurantSetupStatus,
  restaurants,
} from "@/lib/db/schema/schema"
import { getProfileSubscription } from "@/lib/pricing/get-profile-subscription"
import { getProfileRestaurants } from "@/lib/restaurants/get-profile-restaurant"
import { createRestaurantSchema } from "@/lib/restaurants/schema/restaurant-schema"

export async function POST(request: Request) {
  const profile = await currentProfile()

  if (!profile) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
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
  const profileSubscriptionTier = await getProfileSubscription(profile.id)
  const restaurantList = await getProfileRestaurants(profile.id)

  if (
    !profileSubscriptionTier ||
    restaurantList.length >= profileSubscriptionTier.restaurantLimit
  ) {
    return Response.json(
      { error: "Exceeded the restaurant limit for your subscription." },
      { status: 403 }
    )
  }
  const parsed = createRestaurantSchema.safeParse(
    await request.json().catch(() => null)
  )

  if (!parsed.success) {
    return Response.json(
      {
        error: "Check the restaurant details and try again.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  try {
    const restaurant = await db.transaction(async (tx) => {
      const [createdRestaurant] = await tx
        .insert(restaurants)
        .values({
          name: parsed.data.name,
          description: parsed.data.description || null,
        })
        .returning({
          id: restaurants.id,
          name: restaurants.name,
          description: restaurants.description,
          status: restaurants.status,
        })

      if (!createdRestaurant) {
        throw new Error("RESTAURANT_CREATE_FAILED")
      }

      await tx.insert(restaurantMembers).values({
        restaurantId: createdRestaurant.id,
        profileId: profile.id,
        role: "OWNER",
      })

      await tx.insert(restaurantSetupStatus).values({
        restaurantId: createdRestaurant.id,
        restaurantBasicStatus: "IN_PROGRESS",
      })

      return createdRestaurant
    })

    return Response.json(
      {
        restaurant,
        next: `/dashboard/restaurants/${restaurant.id}/setup/basic`,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Restaurant creation failed.", error)
    return Response.json(
      { error: "Restaurant creation failed." },
      { status: 500 }
    )
  }
}
