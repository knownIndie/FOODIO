import { ArrowLeftIcon, Clock3Icon, StoreIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getCurrentRestaurant } from "@/lib/restaurants/current-restaurant"

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params
  const currentRestaurant = await getCurrentRestaurant(restaurantId)

  if (currentRestaurant.restaurant.status === "DRAFT") {
    redirect(`/dashboard/restaurants/${restaurantId}/setup`)
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Button
        nativeButton={false}
        variant="ghost"
        className="w-fit"
        render={<Link href="/dashboard" />}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back to dashboard
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <StoreIcon className="size-5" />
          </div>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <CardTitle className="text-2xl">
                {currentRestaurant.restaurant.name}
              </CardTitle>
              <CardDescription>
                Your restaurant onboarding has been submitted.
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {currentRestaurant.restaurant.status.replaceAll("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Clock3Icon className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">Review in progress</p>
            <p className="text-muted-foreground">
              FoodIO will show approval or follow-up information here. Editing
              will become available after account review.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
