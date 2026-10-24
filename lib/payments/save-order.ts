// this function is used to save the current order state in the db , it also allows us to use this
// we are trying to save -> FoodOrders and FoodItems that were ordered , given in this one can fail and other can pass we want to make sure to only have either both save or both not save

import "server-only"
import { and, eq } from "drizzle-orm"
import { db } from "../db/drizzle"
import { foodOrderItems, foodOrders } from "../db/schema/schema"
import type { OrderSchemaCheck } from "./order-schema"
import { prepareOrderForPayment } from "./prepare-order"

export class SaveOrderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SaveOrderError"
  }
}

export async function savePendingOrder(
  customerId: number,
  input: OrderSchemaCheck
) {
  // validate the order again
  const currentOrder = await prepareOrderForPayment(input)

  const { items, ...orderData } = currentOrder

  return db.transaction(async (tx) => {
    // check if we can actually add to foodOrders

    //[ON CONFLICT DO NOTHING] — decides what happens when an insert violates a uniqueness rule.

    //[RETURNING] — asks the database to send back data from rows that the query inserted or changed.

    const [createOrder] = await tx
      .insert(foodOrders)
      .values({ customerId, ...orderData })
      .onConflictDoNothing({
        target: [foodOrders.customerId, foodOrders.checkoutRequestId],
      })
      .returning()
    if (!createOrder) {
      const [existingOrder] = await tx
        .select()
        .from(foodOrders)
        .where(
          and(
            eq(foodOrders.customerId, customerId),
            eq(foodOrders.checkoutRequestId, currentOrder.checkoutRequestId)
          )
        )
        .limit(1)
      if (!existingOrder) {
        throw new SaveOrderError(
          "Order insertion was skipped, and the existing order could not be found"
        )
      }
      if (existingOrder) {
        const savedItemsInDB = await tx
          .select({
            menuItemId: foodOrderItems.menuItemId,
            quantity: foodOrderItems.quantity,
          })
          .from(foodOrderItems)
          .where(eq(foodOrderItems.foodOrderId, existingOrder.id))

        const menuCheck =
          savedItemsInDB.length === items.length &&
          savedItemsInDB.every((menuItemDb) =>
            currentOrder.items.some((orderMenuItem) => {
              return (
                orderMenuItem.id === menuItemDb.menuItemId &&
                orderMenuItem.quantity === menuItemDb.quantity
              )
            })
          )

        const restaurantCheck =
          existingOrder.restaurantId === currentOrder.restaurantId

        const AddressCheck =
          existingOrder.deliveryAddress.billingAddress ===
            currentOrder.deliveryAddress.billingAddress &&
          existingOrder.deliveryAddress.postalCode ===
            currentOrder.deliveryAddress.postalCode &&
          existingOrder.deliveryAddress.customerName ===
            currentOrder.deliveryAddress.customerName &&
          existingOrder.deliveryAddress.city ===
            currentOrder.deliveryAddress.city &&
          existingOrder.deliveryAddress.state ===
            currentOrder.deliveryAddress.state &&
          existingOrder.deliveryAddress.phone ===
            currentOrder.deliveryAddress.phone

        if (!restaurantCheck || !AddressCheck || !menuCheck) {
          throw new SaveOrderError("Checkout details have changed")
        }

        return existingOrder
      }
    }
    await tx.insert(foodOrderItems).values(
      items.map((menuItem) => ({
        foodOrderId: createOrder.id,
        menuItemId: menuItem.id,
        itemName: menuItem.name,
        unitPriceInPaise: menuItem.priceInPaise,
        quantity: menuItem.quantity,
      }))
    )

    return createOrder
  })
}

export type SavedPendingOrder = Awaited<ReturnType<typeof savePendingOrder>>
// allows us to get type of the order returned by savePendingOrder
