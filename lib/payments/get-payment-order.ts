// this is used to get order detaild given customer ID and food order ID

import { and, eq } from "drizzle-orm"
import { db } from "../db/drizzle"
import { foodOrders } from "../db/schema/schema"

export async function getPaymentOrder(customerId: number, foodOrderId: string) {
  const [order] = await db
    .select()
    .from(foodOrders)
    .where(
      and(eq(foodOrders.customerId, customerId), eq(foodOrders.id, foodOrderId))
    )
    .limit(1)

  return order ?? null
}
