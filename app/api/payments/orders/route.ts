import { currentProfile } from "@/lib/auth/current-profile"
import { RazorpayOrderError } from "@/lib/payments/create-razorpay-order"
import { orderSchemaCheck } from "@/lib/payments/order-schema"
import { CheckoutError } from "@/lib/payments/prepare-order"
import {
  prepareRazorpayPaymenSetupError,
  prepareRazorpayPayment,
} from "@/lib/payments/prepare-razorpay-payment"
import { SaveOrderError, savePendingOrder } from "@/lib/payments/save-order"
import { saveRazorpayOrderError } from "@/lib/payments/save-razorpay-order"
import z from "zod"

export const runtime = "nodejs" // as this make sure where our code runs it has the most-compatability as this is super important

export async function POST(request: Request) {
  try {
    const requestOrigin = request.headers.get("origin") // used to get the origin from the request headers
    const appOrigin = new URL(request.url).origin // used to get the application origin from the request URL

    if (!requestOrigin || requestOrigin !== appOrigin) {
      return Response.json(
        { success: false, error: "Invalid origin" },
        { status: 403 }
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
        { status: 400 }
      )
    }

    const currentUserProfile = await currentProfile()

    if (!currentUserProfile) {
      return Response.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 }
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
        { status: 400 }
      )
    }

    const valdiatedResult = orderSchemaCheck.safeParse(body)

    if (!valdiatedResult.success) {
      return Response.json(
        {
          success: false,
          error: "Invalid checkout details",
          details: z.treeifyError(valdiatedResult.error),
        },
        { status: 400 }
      )
    }

    const orderData = valdiatedResult.data
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID

    if (!razorpayKeyId) {
      throw new Error("Razorpay key ID is not configured")
    }

    const pendingOrder = await savePendingOrder(
      currentUserProfile.id,
      orderData
    )

    const order = await prepareRazorpayPayment(
      currentUserProfile.id,
      pendingOrder.id
    )

    return Response.json(
      {
        success: true,
        razorpayKeyId,
        foodOrderId: order.id,
        razorpayOrderId: order.razorpayOrderId,
        paymentStatus: order.paymentStatus,
        amountInPaise: order.amountInPaise,
        currency: order.currency,
        bill: {
          subtotalInPaise: order.subtotalInPaise,
          deliveryFeeInPaise: order.deliveryFeeInPaise,
          taxInPaise: order.taxInPaise,
          discountInPaise: order.discountInPaise,
        },
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" },
      }
    )
  } catch (error) {
    if (error instanceof prepareRazorpayPaymenSetupError) {
      return Response.json(
        {
          success: false,
          code: "PAYMENT_SETUP_BLOCKED",
          error: error.message,
        },
        {
          status: 409,
          headers: { "Cache-Control": "no-store" },
        }
      )
    }

    if (
      error instanceof RazorpayOrderError ||
      error instanceof saveRazorpayOrderError
    ) {
      console.error("Payment setup could not be confirmed:", error)

      return Response.json(
        {
          success: false,
          code: "PAYMENT_SETUP_UNCONFIRMED",
          error:
            "Payment setup could not be confirmed. Check this checkout before retrying.",
        },
        {
          status: 500,
          headers: { "Cache-Control": "no-store" },
        }
      )
    }
    if (error instanceof CheckoutError) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }
    if (error instanceof SaveOrderError) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }
    console.error("Error processing order:", error)

    return Response.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    )
  }
}
