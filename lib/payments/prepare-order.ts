// this will help to prepare the order for payment processing by checking the price at server side and calculating the total price of the order, including taxes and delivery fees. It will also check if the restaurant is open and if the items are available for order. If everything is valid, it will return a prepared order object that can be used for payment processing.
import "server-only"
import { and, eq, inArray } from "drizzle-orm"
import z from "zod"
import { db } from "../db/drizzle"
import { menuItems, restaurants } from "../db/schema/schema"
import type { OrderSchemaCheck } from "./order-schema"

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "CheckoutError"
  }
}

export async function prepareOrderForPayment(order: OrderSchemaCheck) {
  // check if the restaurant is open
  // if the items are available for order
  // check the items prices and calculate the total price of the order, including taxes and delivery fees

  const [restaurant] = await db
    .select({ id: restaurants.id })
    .from(restaurants)
    .where(
      and(
        eq(restaurants.id, order.restaurantId),
        eq(restaurants.status, "ACTIVE")
      )
    )
    .limit(1)
  if (!restaurant) {
    throw new CheckoutError("Restaurant not found or inactive")
  }

  const menuItemsIds = order.items.map((item) => item.menuItemId)

  const Dishes = await db
    .select({
      id: menuItems.id,
      name: menuItems.name,
      priceInPaise: menuItems.priceInPaise,
      isActive: menuItems.isActive,
      isAvailable: menuItems.isAvailable,
    })
    .from(menuItems)
    .where(
      and(
        eq(menuItems.restaurantId, order.restaurantId),
        inArray(menuItems.id, menuItemsIds)
      )
    )

  const dishesMappedWithPrice = order.items.map((item) => {
    const dbMenuItem = Dishes.find((dish) => dish.id === item.menuItemId)

    if (!dbMenuItem) {
      throw new CheckoutError(
        `Dish with id ${item.menuItemId} not found in restaurant`
      )
    }

    if (!dbMenuItem.isActive || !dbMenuItem.isAvailable) {
      throw new CheckoutError(`${dbMenuItem.name} is currently unavailable`)
    }

    if (
      !Number.isSafeInteger(dbMenuItem.priceInPaise) ||
      dbMenuItem.priceInPaise < 0
    ) {
      throw new Error("The menu contains an invalid price")
    }

    const totalPriceInPaise = dbMenuItem.priceInPaise * item.quantity

    return {
      id: dbMenuItem.id,
      name: dbMenuItem.name,
      priceInPaise: dbMenuItem.priceInPaise,
      totalPriceInPaise,
      quantity: item.quantity,
    }
  })

  // const totalDishPricesArray=dishesMappedWithPrice.map((dish)=>dish.totalPriceInPaise)
  // const subtotalInPaise=totalDishPricesArray.reduce((acc,dishPrice)=>acc+dishPrice,0)

  const subtotalInPaise = dishesMappedWithPrice.reduce(
    (acc, dish) => acc + dish.totalPriceInPaise,
    0
  )

  const deliveryFeeInPaise = 9000
  const taxInPaise = 8000
  const discountInPaise = 2000

  const amountInPaise =
    subtotalInPaise + deliveryFeeInPaise + taxInPaise - discountInPaise

  const validAmount = z.int32().positive().safeParse(amountInPaise)

  if (!validAmount.success) {
    throw new CheckoutError("The order total is outside the allowed range")
  }
  return {
    checkoutRequestId: order.checkoutId,
    restaurantId: restaurant.id,
    deliveryAddress: order.deliveryAddress,
    subtotalInPaise,
    deliveryFeeInPaise,
    taxInPaise,
    discountInPaise,
    amountInPaise,
    currency: "INR" as const,
    items: dishesMappedWithPrice,
  }
}
