import { MapPin } from "lucide-react"
import type { ReactNode } from "react"
import type { deliveryAddress } from "@/lib/checkout/address-schema"

export function DeliveryDetails({
  address,
  action,
}: {
  address: deliveryAddress
  action: ReactNode
}) {
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
        <div className="self-start sm:shrink-0">{action}</div>
      </div>
    </div>
  )
}
