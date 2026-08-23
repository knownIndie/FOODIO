import { ArrowLeftIcon, StoreIcon } from "lucide-react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { RestaurantApprovalActions } from "@/components/admin/restaurant-approval-actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getApprovalRestaurant } from "@/lib/admin/approval-restaurants"
import { currentProfile } from "@/lib/auth/current-profile"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"

function DetailRow({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="grid gap-1 sm:grid-cols-[12rem_1fr]">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium break-words">{value || "Not provided"}</dd>
    </div>
  )
}

export default async function AdminRestaurantReviewPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login/admin")
  }

  if (!profile.roles.includes("ADMIN")) {
    redirect("/")
  }

  const { restaurantId } = await params
  const parsedRestaurantId = restaurantIdSchema.safeParse(restaurantId)
  if (!parsedRestaurantId.success) notFound()

  const restaurant = await getApprovalRestaurant(parsedRestaurantId.data)
  if (!restaurant) notFound()

  const maskedAccount = restaurant.bank?.accountNumber
    ? `•••• ${restaurant.bank.accountNumber.slice(-4)}`
    : null

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
      <Button
        nativeButton={false}
        variant="ghost"
        className="w-fit"
        render={<Link href="/dashboard/admin" />}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back to admin dashboard
      </Button>

      <Card>
        <CardHeader className="border-b">
          <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <StoreIcon className="size-5" />
          </div>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <CardTitle className="text-2xl">{restaurant.name}</CardTitle>
              <CardDescription>
                Review the submitted restaurant information before deciding.
              </CardDescription>
            </div>
            <Badge variant="secondary">
              {restaurant.status.replaceAll("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="grid gap-8 pt-6">
          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold">
              Restaurant details
            </h2>
            <dl className="grid gap-3 text-sm">
              <DetailRow label="Description" value={restaurant.description} />
              <DetailRow label="Phone" value={restaurant.phone} />
              <DetailRow label="Email" value={restaurant.email} />
              <DetailRow label="Address" value={restaurant.address} />
              <DetailRow
                label="Cuisine types"
                value={restaurant.cuisineTypes}
              />
              <DetailRow
                label="Coordinates"
                value={
                  restaurant.latitude !== null && restaurant.longitude !== null
                    ? `${restaurant.latitude}, ${restaurant.longitude}`
                    : null
                }
              />
            </dl>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold">
              Business details
            </h2>
            <dl className="grid gap-3 text-sm">
              <DetailRow
                label="Legal name"
                value={restaurant.business?.legalName}
              />
              <DetailRow
                label="Entity type"
                value={restaurant.business?.entityType.replaceAll("_", " ")}
              />
              <DetailRow
                label="Registered address"
                value={restaurant.business?.registeredAddress}
              />
              <DetailRow
                label="Owner or contact"
                value={restaurant.business?.ownerOrPocName}
              />
              <DetailRow
                label="Contact phone"
                value={restaurant.business?.ownerOrPocPhone}
              />
            </dl>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold">
              Compliance registrations
            </h2>
            <dl className="grid gap-3 text-sm">
              {restaurant.compliance.length > 0 ? (
                restaurant.compliance.map((item) => (
                  <DetailRow
                    key={item.type}
                    label={item.type.replaceAll("_", " ")}
                    value={item.registrationNumber}
                  />
                ))
              ) : (
                <DetailRow label="Registrations" value={null} />
              )}
            </dl>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-lg font-semibold">
              Settlement account
            </h2>
            <dl className="grid gap-3 text-sm">
              <DetailRow label="Bank" value={restaurant.bank?.bankName} />
              <DetailRow label="Account number" value={maskedAccount} />
              <DetailRow label="IFSC" value={restaurant.bank?.ifsc} />
            </dl>
          </section>
        </CardContent>

        {restaurant.status === "PENDING_REVIEW" ? (
          <CardFooter className="border-t pt-5">
            <RestaurantApprovalActions restaurantId={restaurant.id} />
          </CardFooter>
        ) : null}
      </Card>
    </div>
  )
}
