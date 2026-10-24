import { currentProfile } from "@/lib/auth/current-profile"
import z from "zod"
import { getPaymentOrder } from "@/lib/payments/get-payment-order"
import { isValidRazorpaySignature } from "@/lib/payments/verify-signature"
import { getRazorpayClient } from "@/lib/payments/razorpay"
import {
  GatewayPayment,
  recordPayment,
  RecordPaymentError,
} from "@/lib/payments/record-payment"
import { db } from "@/lib/db/drizzle"

export const runtime = "nodejs"

const noStore = { "Cache-Control": "no-store" }

const verifyPaymentSchema = z.strictObject({
  foodOrderId: z.uuid(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const requestOrigin = request.headers.get("origin") // used to get the origin from the request headers
    const appOrigin = new URL(request.url).origin // used to get the application origin from the request URL

    if (!requestOrigin || requestOrigin !== appOrigin) {
      return Response.json(
        { success: false, error: "Invalid origin" },
        { status: 403, headers: noStore }
      )
    }
    const contentType = request.headers.get("content-type")
    if (
      contentType?.split(";")[0].trim().toLowerCase() !== "application/json"
    ) {
      return Response.json(
        {
          success: false,
          error: "Invalid content type",
        },
        { status: 400, headers: noStore }
      )
    }

    const profile = await currentProfile()

    if (!profile) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401, headers: noStore }
      )
    }
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return Response.json(
        {
          success: false,
          error: "The request contains invalid JSON",
        },
        { status: 400, headers: noStore }
      )
    }
    const validatedResult = verifyPaymentSchema.safeParse(body)

    if (!validatedResult.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid checkout details",
          details: z.treeifyError(validatedResult.error),
        },
        { status: 400, headers: noStore }
      )
    }
    const {
      foodOrderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = validatedResult.data

    const paymentStatus = await getPaymentOrder(profile.id, foodOrderId)

    if (!paymentStatus || paymentStatus.razorpayOrderId !== razorpay_order_id) {
      return Response.json(
        {
          success: false,
          error: "Invalid order or not found",
        },
        { status: 404, headers: noStore }
      )
    }

    if (paymentStatus.paymentStatus === "PAID") {
      return Response.json(
        { success: true, paymentStatus: "PAID" },
        { status: 200, headers: noStore }
      )
    }

    const secret = process.env.RAZORPAY_KEY_SECRET
    if (!secret) throw new Error("Razorpay key secret is not configured")

    // build the payload from our saved order, never from the browser's copy
    const signatureIsValid = isValidRazorpaySignature(
      `${paymentStatus.razorpayOrderId}|${razorpay_payment_id}`,
      razorpay_signature,
      secret
    )
    if (!signatureIsValid) {
      return Response.json(
        { success: false, error: "Payment signature is invalid" },
        { status: 400, headers: noStore }
      )
    }

    // ask Razorpay for the facts before the transaction opens, so no row lock is held during the network call
    const payment =
      await getRazorpayClient().payments.fetch(razorpay_payment_id)

    const gatewayPayment: GatewayPayment = {
      id: payment.id,
      orderId: payment.order_id,
      status: payment.status,
      amountInPaise: Number(payment.amount),
      currency: payment.currency,
      failureReason: payment.error_description,
    }

    await db.transaction(async (tx) => {
      await recordPayment(tx, gatewayPayment)
    })

    const updated = await getPaymentOrder(profile.id, foodOrderId)
    return Response.json(
      { success: true, paymentStatus: updated?.paymentStatus },
      { status: 200, headers: noStore }
    )
  } catch (error) {
    if (error instanceof RecordPaymentError) {
      return Response.json(
        { success: false, error: error.message },
        { status: 409, headers: noStore }
      )
    }

    console.error("Error verifying payment:", error)
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500, headers: noStore }
    )
  }
}
