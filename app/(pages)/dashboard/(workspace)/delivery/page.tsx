import { redirect } from "next/navigation"
import { ClaimOrderButton } from "@/components/delivery/claim-order-button"
import { DeliveryStatusPill, OrderList } from "@/components/orders/order-list"
import { RefreshAt } from "@/components/orders/refresh-at"
import { currentProfile } from "@/lib/auth/current-profile"
import { nextStatusChange } from "@/lib/orders/delivery-status"
import { getDeliveryOrders } from "@/lib/orders/get-orders"

export default async function DeliveryDashboardPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login/delivery")
  }

  if (!profile.roles.includes("DELIVERY_PARTNER")) {
    redirect("/")
  }

  const { available, mine } = await getDeliveryOrders(profile.id)
  const refreshAt = nextStatusChange(mine)?.toISOString() ?? null

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-4">
      <RefreshAt at={refreshAt} />
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">
          Deliveries
        </h1>
        <p className="text-muted-foreground">
          Claim a paid order to deliver it. Once claimed, it moves to your
          deliveries and finishes as delivered or cancelled after 20 seconds.
        </p>
      </div>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-bold">
          Available orders{" "}
          <span className="text-muted-foreground">({available.length})</span>
        </h2>
        <OrderList
          orders={available}
          showRestaurant
          emptyMessage="No orders waiting for a delivery partner right now."
          renderAction={(order) => <ClaimOrderButton orderId={order.id} />}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-heading text-xl font-bold">
          Your deliveries{" "}
          <span className="text-muted-foreground">({mine.length})</span>
        </h2>
        <OrderList
          orders={mine}
          showRestaurant
          emptyMessage="You have not claimed any orders yet."
          renderAction={(order) => <DeliveryStatusPill order={order} />}
        />
      </section>
    </div>
  )
}
