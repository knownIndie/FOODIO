import { notFound, redirect } from "next/navigation"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"

export default async function LegacySetupSection({
  params,
}: {
  params: Promise<{ restaurantId: string; section: string }>
}) {
  const { restaurantId } = await params
  if (!restaurantIdSchema.safeParse(restaurantId).success) notFound()
  redirect(`/dashboard/restaurants/${restaurantId}/setup`)
}
