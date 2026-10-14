import { currentProfile } from "@/lib/auth/current-profile"
import { orderSchemaCheck } from "@/lib/payments/order-schema"
import { CheckoutError } from "@/lib/payments/prepare-order"
import { SaveOrderError, savePendingOrder } from "@/lib/payments/save-order"
import z from "zod"

export const runtime = "nodejs" // as this make sure where our code runs it has the most-compatability as this is super important

export async function POST(request: Request) {
  try {
    const requestOrigin = request.headers.get("origin") // used to get the origin from the request headers
    const appOrigin = new URL(request.url).origin // used to get the application origin from the request URL
    if (!requestOrigin || requestOrigin !== appOrigin) {
      return new Response("Invalid origin", { status: 403 })
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
          error: z.treeifyError(valdiatedResult.error),
        },
        { status: 400 }
      )
    }

    const orderData = valdiatedResult.data

    const runSaveOrder = await savePendingOrder(
      currentUserProfile.id,
      orderData
    )

    return Response.json(
      {
        success: true,
        foodOrderId: runSaveOrder.id,
        paymentStatus: runSaveOrder.paymentStatus,
        amountInPaise: runSaveOrder.amountInPaise,
      },
      {
        status: 200,
        headers: {
          "cache-control": "no-store",
          // to make sure the response is not cached
        },
      }
    )
  } catch (error) {
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
