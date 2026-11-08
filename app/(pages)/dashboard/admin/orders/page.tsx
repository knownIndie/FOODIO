import { OrderList } from "@/components/orders/order-list"
import { RefreshAt } from "@/components/orders/refresh-at"
import { requireAdmin } from "@/lib/auth/require-admin"
import { nextStatusChange } from "@/lib/orders/delivery-status"
import { getAdminOrders } from "@/lib/orders/get-orders"

export default async function AdminOrdersPage() {
  await requireAdmin()

  const orders = await getAdminOrders()
  const refreshAt = nextStatusChange(orders)?.toISOString() ?? null

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-4">
      <RefreshAt at={refreshAt} />
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Orders
        </h1>
        <p className="text-muted-foreground">
          Paid orders from all restaurants, newest first.
        </p>
      </div>

      <OrderList
        orders={orders}
        showRestaurant
        emptyMessage="No paid orders yet."
      />
    </div>
  )
}
