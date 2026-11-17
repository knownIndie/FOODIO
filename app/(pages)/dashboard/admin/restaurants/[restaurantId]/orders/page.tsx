import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { OrderList } from "@/components/orders/order-list"
import { RefreshAt } from "@/components/orders/refresh-at"
import { Button } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth/require-admin"
import { nextStatusChange } from "@/lib/orders/delivery-status"
import { getAdminOrders, getRestaurantName } from "@/lib/orders/get-orders"
import { restaurantIdSchema } from "@/lib/restaurants/schema/restaurant-schema"

export default async function AdminRestaurantOrdersPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  await requireAdmin()

  const { restaurantId } = await params
  const parsedRestaurantId = restaurantIdSchema.safeParse(restaurantId)
  if (!parsedRestaurantId.success) notFound()

  const restaurantName = await getRestaurantName(parsedRestaurantId.data)
  if (!restaurantName) notFound()

  const orders = await getAdminOrders({ restaurantId: parsedRestaurantId.data })
  const refreshAt = nextStatusChange(orders)?.toISOString() ?? null

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-4">
      <RefreshAt at={refreshAt} />
      <Button
        nativeButton={false}
        variant="ghost"
        className="w-fit"
        render={<Link href={`/dashboard/admin/restaurants/${restaurantId}`} />}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        Back to restaurant review
      </Button>

      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          {restaurantName} orders
        </h1>
        <p className="text-muted-foreground">
          Paid orders for this restaurant, newest first.
        </p>
      </div>

      <OrderList
        orders={orders}
        emptyMessage="This restaurant has no paid orders yet."
      />
    </div>
  )
}
