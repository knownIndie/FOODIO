// Atomically claim Razorpay order creation for this customer's food order so repeated clicks or concurrent requests cannot start creation more than once. The claim succeeds only while payment is PENDING, no Razorpay order exists, and creation has not started. Setting razorpayOrderCreationStartedAt marks the order as claimed; subsequent attempts return null. The caller must handle a failed creation explicitly, since this claim does not expire or reset automatically.

import { and, eq, isNull, sql } from "drizzle-orm"
import { db } from "../db/drizzle"
import { foodOrders } from "../db/schema/schema"

export async function claimRazorpayOrderCreation(
  customerId: number,
  foodOrderId: string
) {
  const [foodOrderClaim] = await db
    .update(foodOrders)
    .set({
      razorpayOrderCreationStartedAt: sql`now()`,
    })
    .where(
      and(
        eq(foodOrders.customerId, customerId),
        eq(foodOrders.id, foodOrderId),
        isNull(foodOrders.razorpayOrderId),
        eq(foodOrders.paymentStatus, "PENDING"),
        isNull(foodOrders.razorpayOrderCreationStartedAt)
      )
    )
    .returning()

  return foodOrderClaim ?? null
}
