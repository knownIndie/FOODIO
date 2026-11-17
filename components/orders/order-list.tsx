import { formatPrice } from "@/components/cart/components/order-price"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ReactNode } from "react"
import {
  type DeliveryStatus,
  deliveryStatus,
} from "@/lib/orders/delivery-status"
import type { OrderRow } from "@/lib/orders/get-orders"
import { cn } from "@/lib/utils"

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
})

// "dashboard" follows the light/dark theme (admin pages).
// "customer" matches the always-light customer site (cart, checkout, homepage).
type OrderListVariant = "dashboard" | "customer"

const styles = {
  dashboard: {
    text: "text-foreground",
    muted: "text-muted-foreground",
    divider: "border-border",
  },
  customer: {
    text: "text-zinc-900",
    muted: "text-zinc-500",
    divider: "border-zinc-200",
  },
} satisfies Record<OrderListVariant, Record<string, string>>

const statusPill: Record<DeliveryStatus, { label: string; className: string }> =
  {
    WAITING_FOR_PARTNER: {
      label: "Finding a delivery partner",
      className: "bg-zinc-100 text-zinc-700",
    },
    ON_THE_WAY: {
      label: "On the way",
      className: "bg-brand-orange-soft text-brand-orange",
    },
    DELIVERED: {
      label: "Delivered",
      className: "bg-brand-green/10 text-brand-green",
    },
    CANCELLED: {
      label: "Cancelled",
      className: "bg-red-50 text-red-700",
    },
  }

export function DeliveryStatusPill({ order }: { order: OrderRow }) {
  const pill = statusPill[deliveryStatus(order)]
  return (
    <span
      className={cn(
        "w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold",
        pill.className
      )}
    >
      {pill.label}
    </span>
  )
}

function shortOrderId(id: string) {
  return `#${id.slice(0, 8).toUpperCase()}`
}

function PriceLine({
  label,
  value,
  strong = false,
  variant,
}: {
  label: string
  value: number
  strong?: boolean
  variant: OrderListVariant
}) {
  const s = styles[variant]
  return (
    <div
      className={cn(
        "flex justify-between",
        strong ? cn("font-semibold", s.text) : s.muted
      )}
    >
      <span>{label}</span>
      <span>{formatPrice(value)}</span>
    </div>
  )
}

function OrderBody({
  order,
  variant,
}: {
  order: OrderRow
  variant: OrderListVariant
}) {
  const s = styles[variant]
  const address = order.deliveryAddress

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <section className="flex flex-col gap-2">
        <h3 className={cn("font-heading text-sm font-semibold", s.text)}>
          Items
        </h3>
        <ul className={cn("flex flex-col gap-1 text-sm", s.text)}>
          {order.items.map((item, index) => (
            <li
              // item names are not unique per order, so the index is part of the key
              key={`${item.itemName}-${index}`}
              className="flex justify-between gap-4"
            >
              <span>
                {item.quantity} × {item.itemName}
              </span>
              <span>{formatPrice(item.unitPriceInPaise * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div
          className={cn(
            "mt-2 flex flex-col gap-1 border-t pt-2 text-sm",
            s.divider
          )}
        >
          <PriceLine
            label="Subtotal"
            value={order.subtotalInPaise}
            variant={variant}
          />
          <PriceLine
            label="Delivery fee"
            value={order.deliveryFeeInPaise}
            variant={variant}
          />
          <PriceLine label="Tax" value={order.taxInPaise} variant={variant} />
          {order.discountInPaise > 0 && (
            <PriceLine
              label="Discount"
              value={-order.discountInPaise}
              variant={variant}
            />
          )}
          <PriceLine
            label="Total paid"
            value={order.amountInPaise}
            strong
            variant={variant}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2 text-sm">
        <h3 className={cn("font-heading text-sm font-semibold", s.text)}>
          Delivery to
        </h3>
        <p className={cn("font-medium", s.text)}>{address.customerName}</p>
        <p className={s.muted}>{address.phone}</p>
        <p className={s.muted}>
          {address.billingAddress}, {address.city}, {address.state}{" "}
          {address.postalCode}
        </p>
      </section>
    </div>
  )
}

export function OrderList({
  orders,
  showRestaurant = false,
  emptyMessage,
  variant = "dashboard",
  renderAction,
}: {
  orders: OrderRow[]
  showRestaurant?: boolean
  emptyMessage: string
  variant?: OrderListVariant
  // Shown in each dashboard card header in place of the status pill, e.g. a claim button.
  renderAction?: (order: OrderRow) => ReactNode
}) {
  if (variant === "customer") {
    if (orders.length === 0) {
      return (
        <p className="rounded-3xl bg-white px-4 py-8 text-center text-zinc-500 shadow-sm">
          {emptyMessage}
        </p>
      )
    }

    return (
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-3xl border border-zinc-200/70 bg-white shadow-sm"
          >
            <header className="flex flex-col justify-between gap-2 border-b border-zinc-200 p-5 sm:flex-row sm:items-start sm:px-6">
              <div>
                <h2 className="font-heading text-lg font-bold text-zinc-900">
                  {showRestaurant ? order.restaurantName : "Order"}{" "}
                  <span className="font-mono text-sm font-normal text-zinc-500">
                    {shortOrderId(order.id)}
                  </span>
                </h2>
                <p className="text-sm text-zinc-500">
                  {dateFormatter.format(order.paidAt ?? order.createdAt)}
                </p>
                {order.deliveryPartnerName ? (
                  <p className="mt-1 text-sm text-zinc-700">
                    Delivery partner:{" "}
                    <span className="font-semibold text-zinc-900">
                      {order.deliveryPartnerName}
                    </span>
                  </p>
                ) : null}
              </div>
              <DeliveryStatusPill order={order} />
            </header>
            <div className="p-5 sm:px-6">
              <OrderBody order={order} variant="customer" />
            </div>
          </article>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader className="border-b">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <CardTitle className="text-lg">
                  {showRestaurant ? order.restaurantName : "Order"}{" "}
                  <span className="font-mono text-sm text-muted-foreground">
                    {shortOrderId(order.id)}
                  </span>
                </CardTitle>
                <CardDescription>
                  {dateFormatter.format(order.paidAt ?? order.createdAt)}
                  {order.deliveryPartnerName
                    ? ` · Delivery partner: ${order.deliveryPartnerName}`
                    : null}
                </CardDescription>
              </div>
              {renderAction ? (
                renderAction(order)
              ) : (
                <DeliveryStatusPill order={order} />
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <OrderBody order={order} variant="dashboard" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
