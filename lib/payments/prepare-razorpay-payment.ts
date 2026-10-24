// this function prepares the Razorpay payment setup by validating order status, claiming order creation, creating the Razorpay order, and saving it to the database. this acts as the entry point for initiating Razorpay payments.For all the steps , making sure that duplicate orders are not created and only one order gets created at a time and we return a duplicate order

import z from "zod"
import { claimRazorpayOrderCreation } from "./claim-razorpay-order-creation"
import { createRazorpayOrder } from "./create-razorpay-order"
import { getPaymentOrder } from "./get-payment-order"
import { getRazorpayClient } from "./razorpay"
import { saveRazorpayOrder } from "./save-razorpay-order"

export class prepareRazorpayPaymenSetupError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "prepareRazorpayPaymentSetupError"
  }
}

export async function prepareRazorpayPayment(
  customerId: number,
  foodOrderId: string
) {
  const orderStatus = await getPaymentOrder(customerId, foodOrderId)
  if (!orderStatus) {
    throw new prepareRazorpayPaymenSetupError(`order not found`)
  }

  if (orderStatus.paymentStatus !== "PENDING") {
    throw new prepareRazorpayPaymenSetupError(
      `this payment is not awaiting payment`
    )
  }
  if (orderStatus.razorpayOrderId) {
    return orderStatus
  }
  if (orderStatus.razorpayOrderCreationStartedAt) {
    throw new prepareRazorpayPaymenSetupError(
      "Payment setup is in progress or needs review. No new Razorpay order was created by this request."
    )
  }

  const validAmount = z.int32().min(100).safeParse(orderStatus.amountInPaise)

  if (!validAmount.success || orderStatus.currency !== "INR") {
    throw new prepareRazorpayPaymenSetupError(
      "The saved payment amount is invalid"
    )
  }

  getRazorpayClient()

  const claimedOrder = await claimRazorpayOrderCreation(customerId, foodOrderId)

  if (!claimedOrder) {
    const latestOrder = await getPaymentOrder(customerId, foodOrderId)

    if (!latestOrder) {
      throw new prepareRazorpayPaymenSetupError("Order not found")
    }

    if (latestOrder.paymentStatus !== "PENDING") {
      throw new prepareRazorpayPaymenSetupError(
        "This order is not awaiting payment"
      )
    }

    if (latestOrder.razorpayOrderId) {
      return latestOrder
    }

    throw new prepareRazorpayPaymenSetupError(
      "Payment setup could not be claimed. Check the saved checkout before retrying."
    )
  }

  const gatewayOrder = await createRazorpayOrder(claimedOrder)

  return await saveRazorpayOrder(customerId, gatewayOrder)
}
