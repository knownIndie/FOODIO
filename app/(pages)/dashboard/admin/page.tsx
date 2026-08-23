import { ShieldCheckIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { PortalPlaceholder } from "@/components/dashboard/portal-placeholder"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getApprovalRestaurants } from "@/lib/admin/approval-restaurants"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function AdminDashboardPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login/admin")
  }

  if (!profile.roles.includes("ADMIN")) {
    redirect("/")
  }
  const restaurants = await getApprovalRestaurants()
  if (restaurants.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
        <PortalPlaceholder
          label="Admin"
          title="Admin dashboard"
          description="This is the restricted starting page for FoodIO administrators."
          username={profile.username}
          icon={ShieldCheckIcon}
        />
        <Card>
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardDescription>
            No restaurants need review at the moment.
          </CardDescription>
        </Card>
      </div>
    )
  }
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-6">
      <PortalPlaceholder
        label="Admin"
        title="Admin dashboard"
        description="This is the restricted starting page for FoodIO administrators."
        username={profile.username}
        icon={ShieldCheckIcon}
      />
      <Card>
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardDescription className="px-(--card-spacing)">
          These restaurants are waiting for review.
        </CardDescription>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} size="sm" className="ring-1 ring-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle>{restaurant.name}</CardTitle>
                  <Badge variant="secondary">
                    {restaurant.status.replaceAll("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  nativeButton={false}
                  className="w-full"
                  render={
                    <Link
                      href={`/dashboard/admin/restaurants/${restaurant.id}`}
                    />
                  }
                >
                  Review restaurant
                </Button>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
