"use client"

import { MapPin, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useCart } from "../cart-provider"
import {
  CheckoutCard,
  CheckoutEmpty,
  CheckoutFooter,
  CheckoutPage,
} from "./checkout-layout"
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
  const canContinue = isReady && items.length > 0 && address !== null

  return (
    <CheckoutPage
      title="Review your order"
      backHref="/customer/order"
      backLabel="Back to cart"
      footer={
        canContinue ? (
          <CheckoutFooter
            title={`Estimated total ${formatPrice(subtotal)}`}
            description="Review complete? Continue to the payment page."
            label="Continue to Payment"
            href="/customer/payment"
          />
        ) : undefined
      }
    >
      {!isReady ? (
        <CheckoutEmpty role="status">Loading your order...</CheckoutEmpty>
      ) : items.length === 0 ? (
        <CheckoutEmpty>
          <ShoppingBag
            aria-hidden="true"
            className="mx-auto mb-4 size-9 text-brand-orange"
          />
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="mt-3 text-zinc-500">
            Add items before reviewing your order.
          </p>
          <Link
            href="/customer"
            className="mx-auto mt-4 flex min-h-11 max-w-xs items-center justify-center rounded-xl bg-brand-orange px-4 py-3 text-sm font-bold text-white hover:bg-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            Browse restaurants
          </Link>
        </CheckoutEmpty>
      ) : !address ? (
        <CheckoutEmpty>
          <MapPin
            aria-hidden="true"
            className="mx-auto mb-4 size-9 text-brand-orange"
          />
          <h2 className="text-xl font-bold">Add your delivery details</h2>
          <p className="mt-3 text-zinc-500">
            Confirm your phone number and address in the cart to continue.
          </p>
          <Link
            href="/customer/order#delivery-address"
            className="mx-auto mt-4 flex min-h-11 max-w-xs items-center justify-center rounded-xl bg-brand-orange px-4 py-3 text-sm font-bold text-white hover:bg-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            Add delivery address
          </Link>
        </CheckoutEmpty>
      ) : (
        <>
          <CheckoutCard aria-labelledby="review-items-title">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="mb-1 text-xs font-extrabold tracking-wider text-zinc-500 uppercase">
                  Your order · {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
                <h2 id="review-items-title" className="text-base font-bold">
                  {items[0]?.restaurantName ?? "Your selected items"}
                </h2>
              </div>
              <Link
                href="/customer/order#cart-items"
                className="flex min-h-11 shrink-0 items-center font-semibold text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
              >
                Edit items
              </Link>
            </div>
            <ul className="mt-2 divide-y divide-zinc-200">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <h3 className="flex items-start gap-2 text-sm font-semibold sm:text-base">
                      <FoodMark veg={item.veg} />
                      {item.name}
                    </h3>
                    <p className="mt-1 text-zinc-500">
                      {item.quantity} × {formatPrice(item.priceInPaise)}
                    </p>
                  </div>
                  <strong className="text-sm whitespace-nowrap">
                    {formatPrice(item.priceInPaise * item.quantity)}
                  </strong>
                </li>
              ))}
            </ul>
          </CheckoutCard>
          <CheckoutCard aria-labelledby="review-address-title">
            <h2 id="review-address-title" className="mb-3 text-base font-bold">
              Delivery address
            </h2>
            <DeliveryDetails
              address={address}
              action={
                <Link
                  href="/customer/order#delivery-address"
                  className="flex min-h-11 items-center font-semibold text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                >
                  Edit address
                </Link>
              }
            />
          </CheckoutCard>
          <OrderBill subtotal={subtotal} collapsible={false} />
          <p className="px-1 text-xs leading-relaxed text-zinc-500">
            <strong>Before you continue:</strong>
            <br />
            Check your items, phone number, and delivery address. Delivery fees
            and taxes are not included in this estimate yet.
          </p>
        </>
      )}
    </CheckoutPage>
  )
}
