import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import { restaurantMembers, restaurants } from "@/lib/db/schema/schema"
import { restaurantFormSchema } from "@/lib/restaurants/schema/restaurant-form-schema"

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

  let body: unknown

  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const parsed = restaurantFormSchema.safeParse(body)

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
      // the [] is required as we are using the .returning , it returns result in the forma on an array
      const [createdRestaurant] = await tx
        .insert(restaurants)
        .values({
          name: parsed.data.name,
          phone: parsed.data.phone,
          email: parsed.data.email || null,
          address: parsed.data.address,
          resmaplatitude: Number(parsed.data.latitude),
          resmaplongitude: Number(parsed.data.longitude),
          description: parsed.data.description || null,
        })
        .returning({
          id: restaurants.id,
          name: restaurants.name,
          status: restaurants.status,
        })

      if (!createdRestaurant) {
        throw new Error(
          "Restaurant insert returned no row, we could not create the restaurant."
        )
      }

      await tx.insert(restaurantMembers).values({
        restaurantId: createdRestaurant.id,
        profileId: profile.id,
        role: "OWNER",
      })

      return createdRestaurant
    })

    return Response.json(
      {
        restaurant,
        next: "/dashboard",
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
