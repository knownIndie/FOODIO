import { notFound, redirect } from "next/navigation"
import { MenuForm } from "@/components/menu/entries/menu-form"
import { Badge } from "@/components/ui/badge"
import { currentProfile } from "@/lib/auth/current-profile"
import { getMenuForOwner } from "@/lib/dashboard-menu/queries"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"

const priceFormatter = new Intl.NumberFormat("en-IN", {
  // JavaScript’s built-in internationalization API. It formats values for different countries, languages, currencies, dates, and numbers.
  style: "currency",
  currency: "INR",
})

export default async function MenuPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params
  // `[restaurantId]` tells Next.js to capture that URL segment and pass it as `params.restaurantId`.
  if (!restaurantIdSchema.safeParse(restaurantId).success) notFound()

  const returnTo = `/dashboard/restaurants/${restaurantId}/menu`

  const profile = await currentProfile()
  if (!profile)
    redirect(`/login/restaurant?returnTo=${encodeURIComponent(returnTo)}`)
  if (!profile.emailVerifiedAt)
    redirect(`/verify-email?returnTo=${encodeURIComponent(returnTo)}`)
  if (!profile.roles.includes("RESTAURANT_OWNER")) redirect("/")

  const data = await getMenuForOwner(profile.id, restaurantId)
  if (!data) notFound()

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4">
      <MenuForm
        restaurantId={data.restaurant.id}
        restaurantName={data.restaurant.name}
      />
      <section
        aria-labelledby="saved-menu-heading"
        className="rounded-2xl border bg-card p-5"
      >
        <h2 id="saved-menu-heading" className="text-xl font-semibold">
          Saved dishes
        </h2>
        {data.items.length === 0 ? (
          <p className="mt-3 text-muted-foreground">
            No dishes saved yet. Add your first batch above.
          </p>
        ) : (
          <ul className="mt-4 divide-y">
            {data.items.map((item) => (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.isVeg ? "Vegetarian" : "Non-vegetarian"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">
                    {!item.isActive
                      ? "Hidden"
                      : item.isAvailable
                        ? "Available"
                        : "Unavailable"}
                  </Badge>
                  <span className="text-sm tabular-nums">
                    {priceFormatter.format(item.priceInPaise / 100)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
