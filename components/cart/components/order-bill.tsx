"use client"

import { ChevronDown, ChevronUp, ReceiptText } from "lucide-react"
import { useId, useState } from "react"
import { CheckoutCard } from "./checkout-layout"
import { formatPrice } from "./order-price"

export function OrderBill({
  subtotal,
  collapsible = true,
}: {
  subtotal: number
  collapsible?: boolean
}) {
  const [expanded, setExpanded] = useState(true)
  const detailsId = useId()
  const heading = (
    <>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
        <ReceiptText aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0">
        <strong className="block text-base font-bold">
          Estimated total {formatPrice(subtotal)}
        </strong>
        <small className="mt-1 block text-xs text-brand-green">
          Final taxes & delivery charges before payment
        </small>
      </span>
    </>
  )
  return (
    <CheckoutCard
      className="overflow-hidden p-0 sm:p-0"
      aria-label="Bill summary"
    >
      {collapsible ? (
        <button
          type="button"
          className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:p-5"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => setExpanded((open) => !open)}
        >
          {heading}
          {expanded ? (
            <ChevronUp className="ml-auto size-5 shrink-0" aria-hidden="true" />
          ) : (
            <ChevronDown
              className="ml-auto size-5 shrink-0"
              aria-hidden="true"
            />
          )}
        </button>
      ) : (
        <div className="flex items-start gap-3 p-4 sm:p-5">{heading}</div>
      )}
      <div
        id={detailsId}
        className="border-t border-zinc-200 p-4 sm:p-5"
        hidden={collapsible && !expanded}
      >
        <dl className="text-zinc-500">
          <div className="flex justify-between gap-5">
            <dt>Item Total</dt>
            <dd className="text-right text-zinc-700">
              {formatPrice(subtotal)}
            </dd>
          </div>
          <div className="mt-3 flex justify-between gap-5">
            <dt>Delivery Fee</dt>
            <dd className="text-right text-zinc-700">To be confirmed</dd>
          </div>
          <div className="mt-4 flex justify-between gap-5 border-t border-dashed border-zinc-300 pt-4">
            <dt>GST & Other Charges</dt>
            <dd className="text-right text-zinc-700">To be confirmed</dd>
          </div>
          <div className="mt-4 flex justify-between gap-5 border-t border-dashed border-zinc-300 pt-4 font-bold text-zinc-700">
            <dt>Estimated total</dt>
            <dd className="text-right text-zinc-700">
              {formatPrice(subtotal)}
            </dd>
          </div>
        </dl>
      </div>
    </CheckoutCard>
  )
}
