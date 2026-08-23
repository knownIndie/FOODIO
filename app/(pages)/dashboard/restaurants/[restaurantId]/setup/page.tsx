import { redirect } from "next/navigation"
import { getCurrentRestaurant } from "@/lib/restaurants/current-restaurant"

export default async function RestaurantSetupPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params
  const currentRestaurant = await getCurrentRestaurant(restaurantId)

  if (currentRestaurant.restaurant.status !== "DRAFT") {
    redirect(`/dashboard/restaurants/${restaurantId}`)
  }

  redirect(
    `/dashboard/restaurants/${restaurantId}/setup/${currentRestaurant.progress.current}`
  )
}
