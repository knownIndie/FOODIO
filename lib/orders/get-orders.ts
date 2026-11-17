import "server-only"
import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import type { deliveryAddress } from "@/lib/checkout/address-schema"
import { db } from "@/lib/db/drizzle"
import {
  foodOrderItems,
  foodOrders,
  profiles,
  restaurants,
} from "@/lib/db/schema/schema"

// Only paid orders are shown. PENDING rows are checkouts that were never finished.

export type OrderItemRow = {
  itemName: string
  unitPriceInPaise: number
  quantity: number
}

export type OrderRow = {
  id: string
  restaurantId: string
  restaurantName: string
  deliveryAddress: deliveryAddress // includes customerName and phone
  subtotalInPaise: number
  deliveryFeeInPaise: number
  taxInPaise: number
  discountInPaise: number
  amountInPaise: number
  paidAt: Date | null
  createdAt: Date
  claimedAt: Date | null
  deliveryOutcome: "DELIVERED" | "CANCELLED" | null
  deliveryPartnerName: string | null
  items: OrderItemRow[]
}

// profiles is joined once more, as the delivery partner (the customer is also a profile).
const deliveryPartners = alias(profiles, "delivery_partners")

const orderColumns = {
  id: foodOrders.id,
  restaurantId: foodOrders.restaurantId,
  restaurantName: restaurants.name,
  deliveryAddress: foodOrders.deliveryAddress,
  subtotalInPaise: foodOrders.subtotalInPaise,
  deliveryFeeInPaise: foodOrders.deliveryFeeInPaise,
  taxInPaise: foodOrders.taxInPaise,
  discountInPaise: foodOrders.discountInPaise,
  amountInPaise: foodOrders.amountInPaise,
  paidAt: foodOrders.paidAt,
  createdAt: foodOrders.createdAt,
  claimedAt: foodOrders.claimedAt,
  deliveryOutcome: foodOrders.deliveryOutcome,
  deliveryPartnerName: deliveryPartners.name,
}

type OrderBase = Omit<OrderRow, "items">

// Loads items for many orders in one query, then groups them by order.
async function attachItems(orders: OrderBase[]): Promise<OrderRow[]> {
  if (orders.length === 0) return []

  const items = await db
    .select({
      foodOrderId: foodOrderItems.foodOrderId,
      itemName: foodOrderItems.itemName,
      unitPriceInPaise: foodOrderItems.unitPriceInPaise,
      quantity: foodOrderItems.quantity,
    })
    .from(foodOrderItems)
    .where(
      inArray(
        foodOrderItems.foodOrderId,
        orders.map((order) => order.id)
      )
    )

  return orders.map((order) => ({
    ...order,
    items: items
      .filter((item) => item.foodOrderId === order.id)
      .map(({ itemName, unitPriceInPaise, quantity }) => ({
        itemName,
        unitPriceInPaise,
        quantity,
      })),
  }))
}

// The customer's own paid orders, newest first.
export async function getCustomerOrders(customerId: number) {
  const orders = await db
    .select(orderColumns)
    .from(foodOrders)
    .innerJoin(restaurants, eq(restaurants.id, foodOrders.restaurantId))
    .leftJoin(
      deliveryPartners,
      eq(deliveryPartners.id, foodOrders.deliveryPartnerId)
    )
    .where(
      and(
        eq(foodOrders.customerId, customerId),
        eq(foodOrders.paymentStatus, "PAID")
      )
    )
    .orderBy(desc(foodOrders.paidAt))

  return attachItems(orders)
}

// Admin view: all paid orders, or one restaurant's paid orders, newest first.
export async function getAdminOrders(filter: { restaurantId?: string } = {}) {
  const conditions = [eq(foodOrders.paymentStatus, "PAID")]
  if (filter.restaurantId) {
    conditions.push(eq(foodOrders.restaurantId, filter.restaurantId))
  }

  const orders = await db
    .select(orderColumns)
    .from(foodOrders)
    .innerJoin(restaurants, eq(restaurants.id, foodOrders.restaurantId))
    .leftJoin(
      deliveryPartners,
      eq(deliveryPartners.id, foodOrders.deliveryPartnerId)
    )
    .where(and(...conditions))
    .orderBy(desc(foodOrders.paidAt))
    .limit(200)

  return attachItems(orders)
}

export async function getRestaurantName(restaurantId: string) {
  const [restaurant] = await db
    .select({ name: restaurants.name })
    .from(restaurants)
    .where(eq(restaurants.id, restaurantId))
    .limit(1)

  return restaurant?.name ?? null
}

// Delivery partner view.
// available: paid orders nobody has claimed yet, oldest first so they get picked up in order.
// mine: orders this partner has claimed, most recently claimed first.
export async function getDeliveryOrders(deliveryPartnerId: number) {
  const [available, mine] = await Promise.all([
    db
      .select(orderColumns)
      .from(foodOrders)
      .innerJoin(restaurants, eq(restaurants.id, foodOrders.restaurantId))
      .leftJoin(
        deliveryPartners,
        eq(deliveryPartners.id, foodOrders.deliveryPartnerId)
      )
      .where(
        and(
          eq(foodOrders.paymentStatus, "PAID"),
          isNull(foodOrders.deliveryPartnerId)
        )
      )
      .orderBy(asc(foodOrders.paidAt))
      .limit(50),
    db
      .select(orderColumns)
      .from(foodOrders)
      .innerJoin(restaurants, eq(restaurants.id, foodOrders.restaurantId))
      .leftJoin(
        deliveryPartners,
        eq(deliveryPartners.id, foodOrders.deliveryPartnerId)
      )
      .where(eq(foodOrders.deliveryPartnerId, deliveryPartnerId))
      .orderBy(desc(foodOrders.claimedAt))
      .limit(50),
  ])

  const [availableWithItems, mineWithItems] = await Promise.all([
    attachItems(available),
    attachItems(mine),
  ])

  return { available: availableWithItems, mine: mineWithItems }
}
