"use client"

import { ChevronDownIcon, LoaderCircleIcon } from "lucide-react"
import { useLocation } from "@/components/customer-homepage/location-provider"

export function LocationChip() {
  const { city, region, status, locate } = useLocation()

  return (
    <button
      type="button"
      aria-label={`Change delivery location, current: ${city}`}
      disabled={status === "locating"}
      onClick={locate}
      className="hidden items-center gap-1 rounded-lg px-2 py-1 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-80 md:inline-flex"
    >
      <span className="font-bold">{city}</span>
      {region && (
        <span className="hidden text-muted-foreground xl:inline">{region}</span>
      )}
      {status === "locating" ? (
        <LoaderCircleIcon
          aria-hidden="true"
          className="size-4 animate-spin text-muted-foreground"
        />
      ) : (
        <ChevronDownIcon
          aria-hidden="true"
          className="size-4 text-muted-foreground"
        />
      )}
    </button>
  )
}
