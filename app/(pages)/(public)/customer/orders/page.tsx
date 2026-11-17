import { redirect } from "next/navigation"
import { OrderList } from "@/components/orders/order-list"
import { RefreshAt } from "@/components/orders/refresh-at"
import { currentProfile } from "@/lib/auth/current-profile"
import { nextStatusChange } from "@/lib/orders/delivery-status"
import { getCustomerOrders } from "@/lib/orders/get-orders"

export default async function CustomerOrdersPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect(
      `/login/customer?returnTo=${encodeURIComponent("/customer/orders")}`
    )
  }

  const orders = await getCustomerOrders(profile.id)
  const refreshAt = nextStatusChange(orders)?.toISOString() ?? null

  return (
    <div className="flex flex-col gap-6">
      <RefreshAt at={refreshAt} />
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-zinc-900">
          Your orders
        </h1>
        <p className="text-zinc-500">Orders you have paid for, newest first.</p>
      </div>

      <OrderList
        orders={orders}
        showRestaurant
        variant="customer"
        emptyMessage="You have not placed any orders yet."
      />
    </div>
  )
}
