import { and, eq, isNull } from "drizzle-orm"
import { z } from "zod"
import { currentProfile } from "@/lib/auth/current-profile"
import { db } from "@/lib/db/drizzle"
import { foodOrders } from "@/lib/db/schema/schema"

type RouteContext = { params: Promise<{ orderId: string }> }

export async function POST(_request: Request, { params }: RouteContext) {
  const profile = await currentProfile()
  if (!profile) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (!profile.roles.includes("DELIVERY_PARTNER")) {
    return Response.json(
      { error: "Delivery partner access is required." },
      { status: 403 }
    )
  }

  const { orderId } = await params
  const parsedOrderId = z.uuid().safeParse(orderId)
  if (!parsedOrderId.success) {
    return Response.json({ error: "Invalid order ID." }, { status: 400 })
  }

  try {
    // One UPDATE with "nobody has claimed it" in the WHERE clause, so if two
    // partners click at the same time only one row update succeeds.
    const [claimed] = await db
      .update(foodOrders)
      .set({
        deliveryPartnerId: profile.id,
        claimedAt: new Date(),
        // Demo: the result is decided now and revealed 20 s later (lib/orders/delivery-status.ts).
        deliveryOutcome: Math.random() < 0.5 ? "DELIVERED" : "CANCELLED",
      })
      .where(
        and(
          eq(foodOrders.id, parsedOrderId.data),
          eq(foodOrders.paymentStatus, "PAID"),
          isNull(foodOrders.deliveryPartnerId)
        )
      )
      .returning({ id: foodOrders.id })

    if (!claimed) {
      const [order] = await db
        .select({
          paymentStatus: foodOrders.paymentStatus,
          deliveryPartnerId: foodOrders.deliveryPartnerId,
        })
        .from(foodOrders)
        .where(eq(foodOrders.id, parsedOrderId.data))
        .limit(1)

      if (!order || order.paymentStatus !== "PAID") {
        return Response.json({ error: "Order not found." }, { status: 404 })
      }

      if (order.deliveryPartnerId === profile.id) {
        return Response.json({ success: true, alreadyYours: true })
      }

      return Response.json(
        { error: "Another delivery partner already claimed this order." },
        { status: 409 }
      )
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Order claim failed.", error)
    return Response.json(
      { error: "Could not claim the order." },
      { status: 500 }
    )
  }
}
