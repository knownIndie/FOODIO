import { MapPin } from "lucide-react"
import Link from "next/link"
import type { deliveryAddress } from "@/lib/checkout/address-schema"

type DeliveryDetailsProps = {
  address: deliveryAddress
  onEdit?: () => void
}

export function DeliveryDetails({ address, onEdit }: DeliveryDetailsProps) {
  return (
    <div className="flex items-start gap-3">
      <MapPin
        aria-hidden="true"
        className="mt-1 size-5 shrink-0 text-brand-green"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
        <div className="min-w-0 flex-1 wrap-break-word">
          <h3 className="text-sm font-semibold">
            Deliver to {address.customerName}
          </h3>
          <p className="mt-1 text-zinc-500">
            {address.billingAddress}, {address.city}, {address.state}{" "}
            {address.postalCode}
          </p>
          <p className="mt-1 text-zinc-500">{address.phone}</p>
        </div>
        {onEdit ? (
          <button
            type="button"
            className="min-h-11 self-start font-semibold text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:shrink-0"
            aria-label="Edit delivery address"
            onClick={onEdit}
          >
            Edit
          </button>
        ) : (
          <Link
            href="/customer/order#delivery-address"
            className="flex min-h-11 self-start items-center font-semibold text-brand-green focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:shrink-0"
          >
            Edit address
          </Link>
        )}
      </div>
    </div>
  )
}
