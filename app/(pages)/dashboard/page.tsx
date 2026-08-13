import { PlusIcon, StoreIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currentProfile } from "@/lib/auth/current-profile"
import { getProfileRestaurants } from "@/lib/restaurants/get-profile-restaurant"

export default async function Page() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login")
  }

  const restaurantList = await getProfileRestaurants(profile.id)
  const canCreateRestaurant = profile.roles.includes("RESTAURANT_OWNER")

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Restaurant workspace</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Welcome back, {profile.name}
          </h1>
        </div>

        {canCreateRestaurant && restaurantList.length > 0 && (
          <Button size="lg" render={<Link href="/dashboard/restaurants/new" />}>
            <PlusIcon data-icon="inline-start" />
            Add another restaurant
          </Button>
        )}
      </div>

      {restaurantList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {restaurantList.map((restaurant) => (
            <Card key={restaurant.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StoreIcon className="size-4" />
                  {restaurant.name}
                </CardTitle>
                <CardDescription>
                  You are this restaurant&apos;s{" "}
                  {restaurant.membershipRole.toLowerCase()}. Its current status
                  is {restaurant.status.toLowerCase()}.
                </CardDescription>
                <CardAction>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                    {restaurant.status.replaceAll("_", " ")}
                  </span>
                </CardAction>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Menu, compliance documents, payouts, and opening hours will be
                  added in the next onboarding steps.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>Register your first restaurant</CardTitle>
            <CardDescription>
              Add the restaurant identity, contact address, and map location. It
              will be saved as a private draft.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {canCreateRestaurant ? (
              <Button
                size="lg"
                render={<Link href="/dashboard/restaurants/new" />}
              >
                <PlusIcon data-icon="inline-start" />
                Add your first restaurant
              </Button>
            ) : (
              <Button size="lg" render={<Link href="/signup/restraurant" />}>
                Set up restaurant owner access
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
