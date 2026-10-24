"use client"

import { MapPin, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "../cart-provider"
import { CheckoutFooter, CheckoutPage } from "./checkout-layout"
import { DeliveryDetails } from "./delivery-details"
import { FoodMark } from "./food-mark"
import { OrderBill } from "./order-bill"
import { formatPrice } from "./order-price"

export default function OrderReview() {
  const { items, isReady, address } = useCart()
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  )
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (!isReady) {
    return (
      <CheckoutPage
        title="Review your order"
        backHref="/customer/order"
        backLabel="Back to cart"
      >
        <p
          role="status"
          className="rounded-3xl bg-white px-4 py-8 text-center text-zinc-500 shadow-sm"
        >
          Loading your order...
        </p>
      </CheckoutPage>
    )
  }

  if (items.length === 0) {
    return (
      <CheckoutPage
        title="Review your order"
        backHref="/customer/order"
        backLabel="Back to cart"
      >
        <section className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
          <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-orange-soft">
            <ShoppingBag
              aria-hidden="true"
              className="size-8 text-brand-orange"
            />
          </span>
          <h2 className="font-heading text-xl font-bold text-zinc-900">
            Your cart is empty
          </h2>
          <p className="mt-2 text-zinc-500">
            Add items before reviewing your order.
          </p>
          <Link
            href="/customer"
            className="mx-auto mt-6 flex min-h-12 max-w-xs items-center justify-center rounded-xl bg-brand-green px-4 py-3 text-sm font-bold text-white hover:bg-brand-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            Browse restaurants
          </Link>
        </section>
      </CheckoutPage>
    )
  }

  if (!address) {
    return (
      <CheckoutPage
        title="Review your order"
        backHref="/customer/order"
        backLabel="Back to cart"
      >
        <section className="rounded-3xl bg-white px-6 py-12 text-center shadow-sm">
          <span className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-orange-soft">
            <MapPin aria-hidden="true" className="size-8 text-brand-orange" />
          </span>
          <h2 className="font-heading text-xl font-bold text-zinc-900">
            Add your delivery details
          </h2>
          <p className="mt-2 text-zinc-500">
            Confirm your phone number and address in the cart to continue.
          </p>
          <Link
            href="/customer/order#delivery-address"
            className="mx-auto mt-6 flex min-h-12 max-w-xs items-center justify-center rounded-xl bg-brand-green px-4 py-3 text-sm font-bold text-white hover:bg-brand-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            Add delivery address
          </Link>
        </section>
      </CheckoutPage>
    )
  }

  return (
    <CheckoutPage
      title="Review your order"
      backHref="/customer/order"
      backLabel="Back to cart"
    >
      <div className="mb-36 grid gap-4 lg:mb-0 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="grid gap-4">
          <section
            aria-labelledby="review-items-title"
            className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-extrabold tracking-wider text-zinc-500 uppercase">
                  Your order · {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
                <h2
                  id="review-items-title"
                  className="mt-1 font-heading text-lg font-bold text-zinc-900"
                >
                  {items[0]?.restaurantName ?? "Your selected items"}
                </h2>
              </div>
              <Link
                href="/customer/order#cart-items"
                className="flex min-h-11 shrink-0 items-center font-semibold text-brand-orange underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
              >
                Edit items
              </Link>
            </div>
            <ul className="mt-2 divide-y divide-zinc-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-3 py-4"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <FoodMark veg={item.veg} />
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-zinc-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-zinc-500">
                        {item.quantity} × {formatPrice(item.priceInPaise)}
                      </p>
                    </div>
                  </div>
                  <strong className="text-sm font-bold whitespace-nowrap text-zinc-900">
                    {formatPrice(item.priceInPaise * item.quantity)}
                  </strong>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="review-address-title"
            className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6"
          >
            <h2
              id="review-address-title"
              className="mb-4 font-heading text-lg font-bold text-zinc-900"
            >
              Delivery address
            </h2>
            <DeliveryDetails address={address} />
          </section>
        </div>

        <section
          aria-label="Order total"
          className="grid gap-4 rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6"
        >
          <OrderBill subtotal={subtotal} collapsible={false} />
          <CheckoutFooter
            title={`Estimated total ${formatPrice(subtotal)}`}
            description="Review complete? Continue to the payment page."
            label="Continue to Payment"
            href="/customer/payment"
          />
          <p className="text-center text-xs leading-relaxed text-zinc-500">
            <strong>Before you continue:</strong>
            <br />
            Check your items, phone number, and delivery address. Delivery fees
            and taxes are not included in this estimate yet.
          </p>
        </section>
      </div>
    </CheckoutPage>
  )
}
