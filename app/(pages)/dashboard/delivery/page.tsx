import { BikeIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { PortalPlaceholder } from "@/components/portal-placeholder"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function DeliveryDashboardPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login/delivery")
  }

  if (!profile.roles.includes("DELIVERY_PARTNER")) {
    redirect("/")
  }

  return (
    <PortalPlaceholder
      label="Delivery partner"
      title="Delivery dashboard"
      description="This is the starting page for FoodIO delivery partners."
      username={profile.username}
      icon={BikeIcon}
    />
  )
}
