"use client"

import { Check, MapPin, Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeliveryAddressForm } from "@/components/checkout/delivery-address-form"
import type { deliveryAddress } from "@/lib/checkout/address-schema"
import { useCart } from "../cart-provider"
import { CheckoutFooter, CheckoutPage } from "./checkout-layout"
import { DeliveryDetails } from "./delivery-details"
import { FoodMark } from "./food-mark"
import { OrderBill } from "./order-bill"
import { formatPrice } from "./order-price"

export default function Cart() {
  const { items, updateQuantity, removeItem, isReady, address, updateAddress } =
    useCart()
  const [editingAddress, setEditingAddress] = useState(false)
  const title = items[0]?.restaurantName ?? "Your cart"
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  )
  const canReview = address !== null && !editingAddress

  function handleDecreaseQuantity(id: number, quantity: number) {
    if (quantity === 1) {
      removeItem(id)
      return
    }
    updateQuantity(id, -1)
  }

  function handleConfirmAddress(confirmedAddress: deliveryAddress) {
    updateAddress(confirmedAddress)
    setEditingAddress(false)
  }

  function handleEditAddress() {
    setEditingAddress(true)
  }

  function handleCancelAddress() {
    setEditingAddress(false)
  }

  if (!isReady) {
    return (
      <CheckoutPage
        title={title}
        backHref="/customer"
        backLabel="Back to restaurants"
      >
        <p
          role="status"
          className="rounded-3xl bg-white px-4 py-8 text-center text-zinc-500 shadow-sm"
        >
          Loading your cart...
        </p>
      </CheckoutPage>
    )
  }

  if (items.length === 0) {
    return (
      <CheckoutPage
        title={title}
        backHref="/customer"
        backLabel="Back to restaurants"
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
            Add something delicious to get started.
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

  return (
    <CheckoutPage
      title={title}
      backHref="/customer"
      backLabel="Back to restaurants"
    >
      <div className="mb-36 grid gap-4 lg:mb-0 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div className="grid gap-4">
          <section
            aria-labelledby="cart-reviewed-title"
            className="flex items-center gap-4 rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm"
          >
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-green text-white"
            >
              <Check className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="cart-reviewed-title"
                className="font-heading text-lg font-bold text-zinc-900"
              >
                Cart reviewed
              </h2>
              <p className="text-zinc-500">
                {itemCount} {itemCount === 1 ? "item" : "items"} from {title}
              </p>
            </div>
            <Link
              href="#cart-items"
              className="font-semibold text-brand-orange underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
            >
              Edit
            </Link>
          </section>

          <section
            id="delivery-address"
            aria-labelledby="address-title"
            className="rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="mb-5 flex items-start gap-4">
              <span
                aria-hidden="true"
                className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-white"
              >
                <MapPin className="size-6" />
              </span>
              <div className="min-w-0">
                <h2
                  id="address-title"
                  className="font-heading text-lg font-bold text-zinc-900"
                >
                  {address && !editingAddress
                    ? "Delivery details"
                    : "Add your delivery details"}
                </h2>
                <p className="mt-1 text-zinc-500">
                  We&apos;ll share these with the kitchen and your delivery
                  partner.
                </p>
              </div>
            </div>
            {address && !editingAddress ? (
              <DeliveryDetails address={address} onEdit={handleEditAddress} />
            ) : (
              <DeliveryAddressForm
                initialAddress={address}
                onConfirm={handleConfirmAddress}
                onCancel={address ? handleCancelAddress : undefined}
              />
            )}
          </section>

          <section
            aria-labelledby="payment-step-title"
            className="flex items-center gap-4 rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm"
          >
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 font-heading text-lg font-bold text-zinc-500"
            >
              3
            </span>
            <div className="min-w-0">
              <h2
                id="payment-step-title"
                className="font-heading text-lg font-bold text-zinc-700"
              >
                Payment
              </h2>
              <p className="text-zinc-500">
                {canReview
                  ? "Review your order before paying"
                  : "Available after you add your delivery details"}
              </p>
            </div>
          </section>
        </div>

        <section
          id="cart-items"
          aria-labelledby="cart-title"
          className="grid gap-5 rounded-3xl border border-zinc-200/70 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6"
        >
          <div className="flex items-center gap-3 border-b border-zinc-200 pb-5">
            <span
              aria-hidden="true"
              className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-soft font-heading text-base font-bold text-brand-orange"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <h2
                id="cart-title"
                className="truncate font-heading text-lg font-bold leading-tight text-zinc-900"
              >
                {title}
              </h2>
              <p className="text-zinc-500">
                Your cart · {itemCount} {itemCount === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <ul className="grid gap-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <FoodMark veg={item.veg} />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-zinc-900">
                      {item.name}
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {item.description}
                      </p>
                    )}
                    <p className="mt-1 text-zinc-500">
                      {item.quantity} × {formatPrice(item.priceInPaise)}
                    </p>
                    <div className="mt-3 flex min-h-11 w-28 items-center justify-between rounded-xl border border-zinc-200 bg-white font-semibold shadow-sm">
                      <button
                        type="button"
                        aria-label={`Decrease ${item.name} quantity`}
                        onClick={() =>
                          handleDecreaseQuantity(item.id, item.quantity)
                        }
                        className="flex size-11 items-center justify-center text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                      >
                        <Minus aria-hidden="true" className="size-4" />
                      </button>
                      <span className="min-w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label={`Increase ${item.name} quantity`}
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex size-11 items-center justify-center text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                      >
                        <Plus aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap text-zinc-900">
                    {formatPrice(item.priceInPaise * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/customer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
            >
              <Plus aria-hidden="true" className="size-4" />
              Add Items
            </Link>
          </div>

          <div className="grid gap-4">
            <OrderBill subtotal={subtotal} />
            <CheckoutFooter
              title={canReview ? "Ready to Review" : "Almost There"}
              description={
                canReview
                  ? "Check your order and bill on the next page"
                  : "Confirm your phone number and delivery address to continue"
              }
              label="Proceed with Review"
              href={canReview ? "/customer/order/review" : undefined}
            />
            <p className="text-center text-xs leading-relaxed text-zinc-500">
              <strong>Before you order:</strong>
              <br />
              Please double-check your items and delivery address. Final charges
              will be confirmed before payment.
            </p>
          </div>
        </section>
      </div>
    </CheckoutPage>
  )
}
