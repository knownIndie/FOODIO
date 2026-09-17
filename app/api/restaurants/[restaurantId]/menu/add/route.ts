import { currentProfile } from "@/lib/auth/current-profile"
import { getProfileSubscription } from "@/lib/pricing/get-profile-subscription"
import { getProfileRestaurants } from "@/lib/restaurants/get-profile-restaurant"

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
}
