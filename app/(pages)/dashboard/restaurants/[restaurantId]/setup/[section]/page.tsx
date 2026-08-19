import { notFound, redirect } from "next/navigation"
import {
  // RestaurantMenuPlaceholder,
  RestaurantReviewSummary,
} from "@/components/restaurants/restaurant-setup-review"
import { RestaurantBankForm } from "@/components/restaurants/sectionForm/bank-form"
import { RestaurantBasicForm } from "@/components/restaurants/sectionForm/basic-form"
import { RestaurantBusinessForm } from "@/components/restaurants/sectionForm/business-form"
import { RestaurantComplianceForm } from "@/components/restaurants/sectionForm/compliance-form"
import { Card } from "@/components/ui/card"
import { getCurrentRestaurant } from "@/lib/restaurants/current-restaurant"
import {
  canVisitRestaurantSetupSection,
  isRestaurantSetupSection,
} from "@/lib/restaurants/restaurant-extra"

export default async function RestaurantSetupSectionPage({
  params,
}: {
  params: Promise<{ section: string; restaurantId: string }>
}) {
  const { section, restaurantId } = await params
  if (!isRestaurantSetupSection(section)) notFound()
  // not found is when the section is not a known setup section

  const currentRestaurant = await getCurrentRestaurant(restaurantId)
  if (currentRestaurant.restaurant.status !== "DRAFT") {
    redirect(`/dashboard/restaurants/${restaurantId}`)
  }

  if (!canVisitRestaurantSetupSection(section, currentRestaurant.setup)) {
    redirect(
      `/dashboard/restaurants/${restaurantId}/setup/${currentRestaurant.progress.current}`
    )
  }

  let content: React.ReactNode // as this page will eventually hold react node
  switch (section) {
    case "basic":
      content = <RestaurantBasicForm restaurantId={restaurantId} />
      break
    case "business":
      content = <RestaurantBusinessForm restaurantId={restaurantId} />
      break
    case "compliance":
      content = <RestaurantComplianceForm restaurantId={restaurantId} />
      break
    case "bank":
      content = <RestaurantBankForm restaurantId={restaurantId} />
      break
    // case "menu":
    //   content = <RestaurantMenuPlaceholder restaurantId={restaurantId} />
    //   break
    case "review":
      content = <RestaurantReviewSummary data={currentRestaurant} />
      break
  }

  return <Card className="w-full [--card-spacing:0rem]">{content}</Card>
}
