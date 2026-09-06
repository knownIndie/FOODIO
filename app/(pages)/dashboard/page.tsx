import { PlusIcon, StoreIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
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
import { getProfileSubscription } from "@/lib/pricing/get-profile-subscription"
import { getProfileRestaurants } from "@/lib/restaurants/get-profile-restaurant"

//  dashboard page where the restatutant data displayed and managed

export default async function Page() {
  const profile = await currentProfile()
  if (!profile) {
    redirect("/login")
  }

  const restaurantList = await getProfileRestaurants(profile.id)

  const profileSubscriptionTeir = await getProfileSubscription(profile.id)

  const canCreateRestaurant = profile.roles.includes("RESTAURANT_OWNER")

  const isAllowedToCreateRestaurant =
    canCreateRestaurant &&
    restaurantList.length < profileSubscriptionTeir?.restaurantLimit

  const showAddMoreRestaurantButton =
    canCreateRestaurant && restaurantList.length > 0
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm text-muted-foreground">Restaurant workspace</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Welcome back, {profile.name}
          </h1>
        </div>

        {/*{isAllowedToCreateRestaurant ? (
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/dashboard/restaurants/new" />}
          >
            <PlusIcon data-icon="inline-start" />
            Add another restaurant
          </Button>
        ) : (
          <Button
            nativeButton={false}
            size="lg"
            render={<Link href="/dashboard/restaurants/new" />}
            disabled
          >
            <PlusIcon data-icon="inline-start" />
            Add another restaurant
          </Button>
        )}*/}

        {showAddMoreRestaurantButton && (
          <Button
            nativeButton={false}
            size="lg"
            render={
              // new thing -> allows to render a different element based on the condition here we are
              // rendering a Link if the condition is true, and a span if it's false
              isAllowedToCreateRestaurant ? (
                <Link href="/dashboard/restaurants/new" />
              ) : (
                <span />
              )
            }
            disabled={!isAllowedToCreateRestaurant}
            // if the condition is false, the span will be rendered and the button will be disabled
            className={
              !isAllowedToCreateRestaurant
                ? "cursor-not-allowed opacity-50"
                : ""
            }
            // if the condition is false, special css will be applied and the button will be disabled else nothing
          >
            <PlusIcon data-icon="inline-start" />
            Add another restaurant
          </Button>
        )}
      </div>

      {restaurantList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {restaurantList.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={
                restaurant.status === "DRAFT"
                  ? `/dashboard/restaurants/${restaurant.id}/setup`
                  : `/dashboard/restaurants/${restaurant.id}`
              }
              aria-label={`Continue setup for ${restaurant.name}`}
              className="block rounded-[min(var(--radius-4xl),24px)] outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            >
              <Card className="h-full cursor-pointer transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <StoreIcon className="size-4" />
                    {restaurant.name}
                  </CardTitle>
                  <CardDescription>
                    You are this restaurant&apos;s{" "}
                    {restaurant.membershipRole.toLowerCase()}. Its current
                    status is {restaurant.status.toLowerCase()}. Restaurant ID:{" "}
                    {restaurant.id}
                  </CardDescription>
                  <CardAction>
                    <Badge variant="secondary">
                      {restaurant.status.replaceAll("_", " ")}
                    </Badge>
                  </CardAction>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Menu, compliance documents, payouts, and opening hours will
                    be added in the next onboarding steps.
                  </p>
                </CardContent>
              </Card>
            </Link>
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
                nativeButton={false}
                size="lg"
                render={<Link href="/dashboard/restaurants/new" />}
              >
                <PlusIcon data-icon="inline-start" />
                Add your first restaurant
              </Button>
            ) : (
              <Button
                nativeButton={false}
                size="lg"
                render={<Link href="/signup/restraurant" />}
              >
                Set up restaurant owner access
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
