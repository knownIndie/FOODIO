// this function saves the Razorpay order ID to the database once we get the created order from the create razorpay order function.

import { and, eq, isNotNull, isNull } from "drizzle-orm"
import { db } from "../db/drizzle"
import { foodOrders } from "../db/schema/schema"
import { CreatedRazorpayOrder } from "./create-razorpay-order"

export class saveRazorpayOrderError extends Error {
  constructor(message: string) {
    super(message) // calls the parent constructor that we are extending , i.e error so that error.message works correctly
    this.name = "saveRazorpayOrderError"
  }
}

export async function saveRazorpayOrder(
  customerId: number,
  gatewayOrder: CreatedRazorpayOrder
) {
  const [savedOrder] = await db
    .update(foodOrders)
    .set({
      razorpayOrderId: gatewayOrder.razorpayOrderId,
    })
    .where(
      and(
        eq(foodOrders.id, gatewayOrder.foodOrderId),
        eq(foodOrders.customerId, customerId),
        eq(foodOrders.paymentStatus, "PENDING"),
        isNotNull(foodOrders.razorpayOrderCreationStartedAt),
        isNull(foodOrders.razorpayOrderId),
        eq(foodOrders.amountInPaise, gatewayOrder.amountInPaise),
        eq(foodOrders.currency, gatewayOrder.currency)
      )
    )
    .returning()

  if (!savedOrder) {
    throw new saveRazorpayOrderError(
      "The Razorpay order could not be attached. Check the saved checkout before retrying."
    )
  }

  return savedOrder
}
