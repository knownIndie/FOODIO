"use client"

import Link from "next/link"
import { useCart } from "@/components/cart/cart-provider"

export default function PaymentPage() {
  const { items, isReady } = useCart()

  if (!isReady) {
    return <p>Loading...</p>
  }

  if (items.length === 0) {
    return (
      <div className="space-y-4">
        <p>Your cart is empty.</p>
        <Link href="/customer">Choose food</Link>
      </div>
    )
  }

  return (
    <section className="mx-auto w-full max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Payment page</h1>

      <p>
        These are your selected dishes. Current prices will be checked on the
        server in the next step.
      </p>

      <ul className="space-y-4">
        {items.map((item) => (
          // The dish ID gives React a stable key for this row.
          <li key={item.id} className="rounded-lg border p-4">
            {/* These values currently come from the browser cart. */}
            <p className="font-medium">{item.name}</p>
            <p>Dish ID: {item.id}</p>
            <p>Quantity: {item.quantity}</p>
          </li>
        ))}
      </ul>

      {/* Return to the cart to change dishes or quantities. */}
      <Link className="block underline" href="/customer/order">
        Back to cart
      </Link>
    </section>
  )
}
