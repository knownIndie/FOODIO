import "server-only"

import { currentProfile } from "@/lib/auth/current-profile"
import {
  restaurantIdSchema,
  restaurantOnboardingSchema,
} from "./schema/restaurant-schema"
import { OnboardingError, submitOnboarding } from "./submit-onboarding"

export async function handleOnboardingRequest(
  request: Request,
  restaurantId?: string
) {
  try {
    const profile = await currentProfile()
    if (!profile)
      return Response.json({ error: "Unauthorized." }, { status: 401 })
    if (
      !profile.emailVerifiedAt ||
      !profile.roles.includes("RESTAURANT_OWNER")
    ) {
      return Response.json(
        { error: "A verified restaurant owner account is required." },
        { status: 403 }
      )
    }
    if (
      restaurantId !== undefined &&
      !restaurantIdSchema.safeParse(restaurantId).success
    ) {
      return Response.json({ error: "Invalid restaurant ID." }, { status: 400 })
    }
    const parsed = restaurantOnboardingSchema.safeParse(
      await request.json().catch(() => null)
    )
    if (!parsed.success) {
      return Response.json(
        {
          error: "Check the highlighted details and try again.",
          fieldErrors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }
    const restaurant = await submitOnboarding(
      profile.id,
      parsed.data,
      restaurantId
    )
    return Response.json(
      { restaurant, next: `/dashboard/restaurants/${restaurant.id}` },
      { status: restaurantId ? 200 : 201 }
    )
  } catch (error) {
    if (error instanceof OnboardingError) {
      return Response.json({ error: error.message }, { status: error.status })
    }
    console.error("Restaurant application failed.", error)
    return Response.json(
      { error: "Could not submit your restaurant. Please try again." },
      { status: 500 }
    )
  }
}
