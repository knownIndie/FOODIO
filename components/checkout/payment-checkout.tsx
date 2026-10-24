"use client"
import Link from "next/link"
import Script from "next/script"
import { useState } from "react"
import { useCart } from "../cart/cart-provider"
import { OrderSchemaCheck } from "@/lib/payments/order-schema"
import { getOrCreateCheckoutId } from "@/lib/checkout/checkout-key"
import { Button } from "../ui/button"
import z from "zod"
import type { RazorpayPaymentResult } from "@/lib/payments/razorpay-types/razorpay"

export type scriptStatus = "loading" | "ready" | "error"

const paymentOrderResponseSchema = z.object({
  success: z.literal(true),
  razorpayKeyId: z.string().min(1),
  foodOrderId: z.uuid(),
  razorpayOrderId: z.string().min(1),
  paymentStatus: z.literal("PENDING"),
  amountInPaise: z.int32().min(100),
  currency: z.literal("INR"),
})

const verifyResponseSchema = z.object({
  success: z.literal(true),
  paymentStatus: z.enum(["PENDING", "PAID"]),
})

export function PaymentCheckout() {
  const { items, isReady, address, clearCart } = useCart()
  const [message, setMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [scriptStatus, setScriptStatus] = useState<scriptStatus>("loading")
  const [paymentResult, setPaymentResult] =
    useState<RazorpayPaymentResult | null>(null)

  async function handlePreparePayment() {
    if (isSubmitting || !isReady || scriptStatus !== "ready" || paymentResult) {
      return
    }
    const firstItem = items[0]

    if (!firstItem || !address) {
      setMessage("Add items and confirm your delivery address first.")
      return
    }

    const RazorpayCheckout = window.Razorpay

    if (typeof RazorpayCheckout !== "function") {
      setMessage("Payment options are not ready. Refresh the page.")
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const requestBody: OrderSchemaCheck = {
        checkoutId: getOrCreateCheckoutId(),
        restaurantId: firstItem.restaurantId,
        deliveryAddress: address,
        items: items.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      }
      const response = await fetch("/api/payments/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (response.status === 401) {
        setMessage("Sign in before continuing to payment.")
        return
      }

      if (response.status === 400) {
        setMessage("Review your cart and delivery details before continuing.")
        return
      }

      if (!response.ok) {
        setMessage(
          "Payment setup could not be confirmed. Check this checkout before trying again."
        )
        return
      }

      // Read the order details returned by our API.
      const responseBody: unknown = await response.json()
      const result = paymentOrderResponseSchema.safeParse(responseBody)

      if (!result.success) {
        setMessage(
          "Payment setup could not be confirmed. Check this checkout before trying again."
        )
        return
      }

      const order = result.data
      setMessage("Payment has not been confirmed.")

      // the popup reports through callbacks, so wrap it in a promise that resolves once
      const payment = await new Promise<RazorpayPaymentResult | null>(
        (resolve) => {
          const checkout = new RazorpayCheckout({
            key: order.razorpayKeyId,
            order_id: order.razorpayOrderId,
            amount: order.amountInPaise,
            currency: order.currency,
            name: "FOODIO",
            prefill: {
              name: address.customerName,
              contact: `+91${address.phone}`,
            },
            handler: (response: RazorpayPaymentResult) => resolve(response),
            modal: {
              ondismiss: () => resolve(null),
            },
          })

          checkout.on("payment.failed", (response) => {
            setMessage(response.error.description)
          })

          checkout.open()
        }
      )

      if (!payment) {
        setMessage("Payment window closed. You can try again.")
        return
      }

      setPaymentResult(payment)
      setMessage("Confirming your payment…")

      // the browser's result is only a claim, so the server verifies it
      try {
        const verifyResponse = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ foodOrderId: order.foodOrderId, ...payment }),
        })
        const verifyBody: unknown = await verifyResponse.json()
        const verified = verifyResponseSchema.safeParse(verifyBody)

        if (verified.success && verified.data.paymentStatus === "PAID") {
          clearCart()
          setMessage(
            `Payment successful. Your order ID is ${order.foodOrderId}.`
          )
        } else {
          setMessage(
            "Payment received, confirmation pending. Do not pay again."
          )
        }
      } catch {
        // the customer has already paid, so never show the generic error here
        setMessage("Payment received, confirmation pending. Do not pay again.")
      }
    } catch {
      setMessage(
        "Could not continue with payment. Review this checkout before trying again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl space-y-4">
      <Script
        id="razorpay-checkout-script"
        src="https://checkout.razorpay.com/v1/checkout.js"
        onReady={() => setScriptStatus("ready")}
        onError={() => setScriptStatus("error")}
      />

      <h1 className="text-2xl font-semibold">Payment</h1>

      <Button
        type="button"
        onClick={handlePreparePayment}
        disabled={
          !isReady ||
          scriptStatus !== "ready" ||
          isSubmitting ||
          paymentResult !== null
        }
      >
        {isSubmitting ? "Payment in progress…" : "Continue to payment"}
      </Button>

      {message && <p role="status">{message}</p>}

      <Link className="inline-block underline" href="/customer/order/review">
        Back to order review
      </Link>
    </section>
  )
}
