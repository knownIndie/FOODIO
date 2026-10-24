import "server-only"
import { and, eq, sql } from "drizzle-orm"
import { db } from "../db/drizzle"
import { foodOrders, paymentAttempts } from "../db/schema/schema"

export type GatewayPayment = {
  id: string
  orderId: string
  status: "created" | "authorized" | "captured" | "failed" | "refunded"
  amountInPaise: number
  currency: string
  failureReason: string | null
}

export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]

export class RecordPaymentError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RecordPaymentError"
  }
}

const attemptStatus = {
  created: "CREATED",
  authorized: "AUTHORIZED",
  captured: "CAPTURED",
  failed: "FAILED",
} as const

export async function recordPayment(tx: Tx, payment: GatewayPayment) {
  if (payment.status === "refunded") return

  // lock the order row so two requests for the same order take turns
  const [order] = await tx
    .select({
      id: foodOrders.id,
      amountInPaise: foodOrders.amountInPaise,
      currency: foodOrders.currency,
    })
    .from(foodOrders)
    .where(eq(foodOrders.razorpayOrderId, payment.orderId))
    .for("update")

  if (!order) throw new RecordPaymentError("No food order matches this payment")
  if (
    order.amountInPaise !== payment.amountInPaise ||
    order.currency !== payment.currency
  ) {
    throw new RecordPaymentError("Payment amount or currency does not match")
  }

  await tx
    .insert(paymentAttempts)
    .values({
      foodOrderId: order.id,
      razorpayPaymentId: payment.id,
      status: attemptStatus[payment.status],
      amountInPaise: payment.amountInPaise,
      currency: payment.currency,
      failureReason: payment.failureReason,
    })
    .onConflictDoUpdate({
      target: paymentAttempts.razorpayPaymentId,
      set: {
        status: attemptStatus[payment.status],
        failureReason: payment.failureReason,
      },
    })

  if (payment.status === "captured") {
    await tx
      .update(foodOrders)
      .set({ paymentStatus: "PAID", paidAt: sql`now()` })
      .where(
        and(
          eq(foodOrders.id, order.id),
          eq(foodOrders.paymentStatus, "PENDING")
        )
      )
  }
}
