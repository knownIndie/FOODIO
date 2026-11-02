import { ChevronDown } from "lucide-react"
import { formatPrice } from "./order-price"

type OrderBillProps = {
  subtotal: number
  collapsible?: boolean
}

export function OrderBill({ subtotal, collapsible = true }: OrderBillProps) {
  const bill = (
    <dl className="mt-4 grid gap-3 text-zinc-500">
      <div className="flex justify-between gap-5">
        <dt>Item total</dt>
        <dd className="text-right font-medium text-zinc-700">
          {formatPrice(subtotal)}
        </dd>
      </div>
      <div className="flex justify-between gap-5">
        <dt>Delivery fee</dt>
        <dd className="text-right text-zinc-700">To be confirmed</dd>
      </div>
      <div className="flex justify-between gap-5">
        <dt>GST & other charges</dt>
        <dd className="text-right text-zinc-700">To be confirmed</dd>
      </div>
      <div className="mt-1 flex justify-between gap-5 border-t border-zinc-300 pt-3 text-base font-bold text-zinc-900">
        <dt>To pay (est.)</dt>
        <dd className="text-right">{formatPrice(subtotal)}</dd>
      </div>
    </dl>
  )

  if (collapsible) {
    return (
      <details
        open
        className="group rounded-2xl bg-page-background p-4"
        aria-label="Bill summary"
      >
        <summary className="flex cursor-pointer list-none items-center justify-between focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange">
          <h3 className="text-sm font-bold text-zinc-900">Bill details</h3>
          <ChevronDown
            aria-hidden="true"
            className="size-5 shrink-0 text-zinc-500 group-open:rotate-180"
          />
        </summary>
        {bill}
      </details>
    )
  }

  return (
    <section
      className="rounded-2xl bg-page-background p-4"
      aria-label="Bill summary"
    >
      <h3 className="text-sm font-bold text-zinc-900">Bill details</h3>
      {bill}
    </section>
  )
}
