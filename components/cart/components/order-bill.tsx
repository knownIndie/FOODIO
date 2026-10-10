import { ChevronDown, ReceiptText } from "lucide-react"
import { formatPrice } from "./order-price"

type OrderBillProps = {
  subtotal: number
  collapsible?: boolean
}

export function OrderBill({ subtotal, collapsible = true }: OrderBillProps) {
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

  const bill = (
    <dl className="border-t border-zinc-200 p-4 text-zinc-500 sm:p-5">
      <div className="flex justify-between gap-5">
        <dt>Item Total</dt>
        <dd className="text-right text-zinc-700">{formatPrice(subtotal)}</dd>
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
        <dd className="text-right">{formatPrice(subtotal)}</dd>
      </div>
    </dl>
  )

  if (collapsible) {
    return (
      <details
        open
        className="group mb-4 overflow-hidden rounded-2xl bg-white"
        aria-label="Bill summary"
      >
        <summary className="flex cursor-pointer list-none items-start gap-3 p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:p-5">
          {heading}
          <ChevronDown
            aria-hidden="true"
            className="ml-auto size-5 shrink-0 group-open:rotate-180"
          />
        </summary>
        {bill}
      </details>
    )
  }

  return (
    <section
      className="mb-4 overflow-hidden rounded-2xl bg-white"
      aria-label="Bill summary"
    >
      <div className="flex items-start gap-3 p-4 sm:p-5">{heading}</div>
      {bill}
    </section>
  )
}
