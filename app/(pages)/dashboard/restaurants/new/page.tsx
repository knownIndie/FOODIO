import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { RestaurantFirstSetupForm } from "@/components/restaurants/restaurant-first-setup-form"
import { Button } from "@/components/ui/button"
import { CardHeader, CardTitle } from "@/components/ui/card"
import { currentProfile } from "@/lib/auth/current-profile"
import { getProfileSubscription } from "@/lib/pricing/get-profile-subscription"
import { getProfileRestaurants } from "@/lib/restaurants/get-profile-restaurant"

export default async function NewRestaurantPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login?returnTo=/dashboard/restaurants/new")
  }

  if (!profile.roles.includes("RESTAURANT_OWNER")) {
    redirect("/signup/restraurant")
  }
  const profileSubscriptionTier = await getProfileSubscription(profile.id)
  const restaurantList = await getProfileRestaurants(profile.id)

  if (
    !profileSubscriptionTier ||
    restaurantList.length >= profileSubscriptionTier.restaurantLimit
  ) {
    redirect("/dashboard")
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 py-4">
      <Button
        nativeButton={false}
        variant="ghost"
        className="w-fit"
        render={<Link href="/dashboard" />}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back to dashboard
      </Button>

      <CardHeader className="text-center  mb-3">
        <CardTitle className="text-2xl">Register your restaurant</CardTitle>
        {/*<CardDescription>
            This creates the restaurant identity and saves it as a private
            draft. Verification documents and menu setup come later.
          </CardDescription>*/}
      </CardHeader>
      {/*<RestaurantOnboardingForm />*/}
      <RestaurantFirstSetupForm />
    </div>
  )
}
