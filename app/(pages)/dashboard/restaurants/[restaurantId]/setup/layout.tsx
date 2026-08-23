import SectionHeader from "@/components/restaurants/section/sectionHeader"
import { getCurrentRestaurant } from "@/lib/restaurants/current-restaurant"

export default async function SetupLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ restaurantId: string }>
}>) {
  const { restaurantId } = await params
  const currentRestaurant = await getCurrentRestaurant(restaurantId)
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6">
      <SectionHeader
        restaurantName={currentRestaurant.restaurant.name}
        restaurantStatus={currentRestaurant.restaurant.status}
        setup={currentRestaurant.setup}
        completed={currentRestaurant.progress.completed}
        total={currentRestaurant.progress.total}
        current={currentRestaurant.progress.current}
      />
      {children}
    </div>
  )
}
