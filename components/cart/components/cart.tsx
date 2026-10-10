"use client"

import { Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeliveryAddressForm } from "@/components/checkout/delivery-address-form"
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

export default function Cart() {
  const { items, updateQuantity, removeItem, isReady, address, updateAddress } =
    useCart()
  const [editingAddress, setEditingAddress] = useState(false)
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  )
  const hasItems = items.length > 0
  const canReview = address !== null && !editingAddress

  return (
    <CheckoutPage
      title={items[0]?.restaurantName ?? "Your cart"}
      backHref="/customer"
      backLabel="Back to restaurants"
      footer={
        isReady && hasItems ? (
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
        ) : undefined
      }
    >
      {!isReady ? (
        <CheckoutEmpty role="status">Loading your cart...</CheckoutEmpty>
      ) : !hasItems ? (
        <CheckoutEmpty>
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
        </CheckoutEmpty>
      ) : (
        <>
          <CheckoutCard id="cart-items" aria-label="Cart items">
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
                    {item.description ? (
                      <p className="mt-1 text-zinc-500">{item.description}</p>
                    ) : null}
                  </div>
                  <div className="flex min-h-11 w-28 shrink-0 items-center justify-between rounded-xl border border-zinc-300 bg-white font-semibold shadow-sm">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() =>
                        item.quantity === 1
                          ? removeItem(item.id)
                          : updateQuantity(item.id, -1)
                      }
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
          </CheckoutCard>
          <CheckoutCard id="delivery-address" aria-labelledby="address-title">
            <h2 id="address-title" className="mb-3 text-base font-bold">
              Delivery address
            </h2>
            {canReview && address ? (
              <DeliveryDetails
                address={address}
                action={
                  <button
                    type="button"
                    className="min-h-11 font-semibold text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                    aria-label="Edit delivery address"
                    onClick={() => setEditingAddress(true)}
                  >
                    Edit
                  </button>
                }
              />
            ) : (
              <>
                <p className="mb-4 text-zinc-500">
                  Enter your phone number and delivery address.
                </p>
                <DeliveryAddressForm
                  embedded
                  showTestDetails
                  initialAddress={address}
                  onConfirm={(confirmed) => {
                    updateAddress(confirmed)
                    setEditingAddress(false)
                  }}
                  onCancel={
                    address ? () => setEditingAddress(false) : undefined
                  }
                />
              </>
            )}
          </CheckoutCard>
          <OrderBill subtotal={subtotal} />
          <p className="px-1 text-xs leading-relaxed text-zinc-500">
            <strong>Before you order:</strong>
            <br />
            Please double-check your items and delivery address. Final charges
            will be confirmed before payment.
          </p>
        </>
      )}
    </CheckoutPage>
  )
}
