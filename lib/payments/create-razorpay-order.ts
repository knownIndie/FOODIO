// this function creates a new Razorpay order for a pending food order

import z from "zod"
import type { SavedPendingOrder } from "./save-order"
import { getRazorpayClient } from "./razorpay"

export type CreatedRazorpayOrder = Awaited<
  ReturnType<typeof createRazorpayOrder>
>

export class RazorpayOrderError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "RazorpayOrderError"
  }
}

export async function createRazorpayOrder(order: SavedPendingOrder) {
  // check if order is in PENDING state
  if (order.paymentStatus !== "PENDING") {
    throw new RazorpayOrderError(`This order is not awaiting payments`)
  }
  // check if order already has Razorpay order ID
  if (order.razorpayOrderId) {
    throw new RazorpayOrderError(`A Razorpay order already exists`)
  }

  // check if the amount is valid or not
  const validAmount = z.int32().min(100).safeParse(order.amountInPaise)

  if (!validAmount.success || order.currency !== "INR") {
    throw new RazorpayOrderError("The saved payment amount is invalid")
  }

  const razorpay = getRazorpayClient()

  try {
    const gatewayOrder = await razorpay.orders.create({
      // official way to make an order using Razorpay
      amount: validAmount.data,
      currency: "INR",
      receipt: order.id,
      partial_payment: false,
      notes: {
        foodOrderId: order.id,
      },
    })

    if (
      !gatewayOrder.id ||
      Number(gatewayOrder.amount) !== order.amountInPaise ||
      gatewayOrder.currency !== order.currency ||
      gatewayOrder.receipt !== order.id
    ) {
      throw new RazorpayOrderError("Razorpay returned unexpected order details")
    }

    return {
      foodOrderId: order.id,
      razorpayOrderId: gatewayOrder.id,
      amountInPaise: order.amountInPaise,
      currency: order.currency,
    }
  } catch (error) {
    if (error instanceof RazorpayOrderError) {
      throw error
    }

    throw new RazorpayOrderError(
      "Payment setup could not be confirmed. Reconcile this checkout before retrying."
    )
  }
}
