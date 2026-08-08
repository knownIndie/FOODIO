import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { RestaurantOnboardingForm } from "@/components/restaurants/restaurant-onboarding-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currentProfile } from "@/lib/auth/current-profile"
import { getProfileRestaurant } from "@/lib/restaurants/get-profile-restaurant"

export default async function NewRestaurantPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login?returnTo=/dashboard/restaurants/new")
  }

  if (!profile.roles.includes("RESTAURANT_OWNER")) {
    redirect("/signup/restraurant")
  }

  const existingRestaurant = await getProfileRestaurant(profile.id)

  if (existingRestaurant) {
    redirect("/dashboard")
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 py-4">
      <Button
        variant="ghost"
        className="w-fit"
        render={<Link href="/dashboard" />}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back to dashboard
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Register your restaurant</CardTitle>
          <CardDescription>
            This creates the restaurant identity and saves it as a private
            draft. Verification documents and menu setup come later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RestaurantOnboardingForm />
        </CardContent>
      </Card>
    </div>
  )
}
