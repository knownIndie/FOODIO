"use client"

import { Minus, Plus, ShoppingBag } from "lucide-react"
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
        <p role="status" className="rounded-2xl bg-white px-4 py-8 text-center">
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
        <section className="rounded-2xl bg-white px-4 py-8 text-center">
          <ShoppingBag
            aria-hidden="true"
            className="mx-auto mb-4 size-9 text-brand-orange"
          />
          <h2 className="text-xl font-bold">Your cart is empty</h2>
          <p className="mt-3 text-zinc-500">
            Add something delicious to get started.
          </p>
          <Link
            href="/customer"
            className="mx-auto mt-4 flex min-h-11 max-w-xs items-center justify-center rounded-xl bg-brand-orange px-4 py-3 text-sm font-bold text-white hover:bg-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
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
      <section
        id="cart-items"
        aria-label="Cart items"
        className="mb-4 rounded-2xl bg-white p-4 sm:p-5"
      >
        <ul className="grid gap-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-4"
            >
              <div className="w-full min-w-0 sm:flex-1">
                <h2 className="flex items-start gap-2 text-sm font-semibold sm:text-base">
                  <FoodMark veg={item.veg} />
                  {item.name}
                </h2>
                {item.description && (
                  <p className="mt-1 text-zinc-500">{item.description}</p>
                )}
              </div>
              <div className="flex min-h-11 w-28 shrink-0 items-center justify-between rounded-xl border border-zinc-300 bg-white font-semibold shadow-sm">
                <button
                  type="button"
                  aria-label={`Decrease ${item.name} quantity`}
                  onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                  className="flex size-11 items-center justify-center text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                >
                  <Minus aria-hidden="true" className="size-4" />
                </button>
                <span className="min-w-6 text-center">{item.quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${item.name} quantity`}
                  onClick={() => updateQuantity(item.id, 1)}
                  className="flex size-11 items-center justify-center text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                >
                  <Plus aria-hidden="true" className="size-4" />
                </button>
              </div>
              <span className="ml-auto text-sm font-semibold whitespace-nowrap sm:min-w-16 sm:text-right">
                {formatPrice(item.priceInPaise * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <Link
          href="/customer"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
        >
          <Plus aria-hidden="true" className="size-5" />
          Add Items
        </Link>
      </section>

      <section
        id="delivery-address"
        aria-labelledby="address-title"
        className="mb-4 rounded-2xl bg-white p-4 sm:p-5"
      >
        <h2 id="address-title" className="mb-3 text-base font-bold">
          Delivery address
        </h2>
        {address && !editingAddress ? (
          <DeliveryDetails address={address} onEdit={handleEditAddress} />
        ) : (
          <>
            <p className="mb-4 text-zinc-500">
              Enter your phone number and delivery address.
            </p>
            <DeliveryAddressForm
              initialAddress={address}
              onConfirm={handleConfirmAddress}
              onCancel={address ? handleCancelAddress : undefined}
            />
          </>
        )}
      </section>

      <OrderBill subtotal={subtotal} />
      <p className="px-1 text-xs leading-relaxed text-zinc-500">
        <strong>Before you order:</strong>
        <br />
        Please double-check your items and delivery address. Final charges will
        be confirmed before payment.
      </p>
      <CheckoutFooter
        title={canReview ? "Ready to Review" : "Almost There"}
        description={
          canReview
            ? "Check your order and bill on the next page"
            : "Confirm your phone number and delivery address to continue"
        }
        label="Proceed with Phone Number"
        href={canReview ? "/customer/order/review" : undefined}
      />
    </CheckoutPage>
  )
}
