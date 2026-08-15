import { getRestaurantOwnerProfile } from "@/lib/restaurants/current-restaurant"

export default async function Page({
  params,
}: {
  params: Promise<{ section: string; restaurantId: string }>
}) {
  const { section, restaurantId } = await params
  const profile = await getRestaurantOwnerProfile(Number(restaurantId))
  return (
    <div>
      hello from
      app/(pages)/dashboard/restaurants/[restaurantId]/setup/[section]/page.tsx
      <main>
        <h1>{profile?.restaurantId}</h1>
        <p>{profile?.profileId}</p>
        <p>{profile?.role}</p>
      </main>
    </div>
  )
}
