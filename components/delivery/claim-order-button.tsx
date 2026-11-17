"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function ClaimOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function claim() {
    setError(undefined)
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/delivery/orders/${orderId}/claim`, {
        method: "POST",
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Could not claim the order.")
        // a 409 means someone else got it: refresh so it leaves the list
        if (response.status === 409) router.refresh()
        return
      }

      router.refresh()
    } catch {
      setError("Could not reach the server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button onClick={() => void claim()} disabled={isSubmitting}>
        {isSubmitting ? "Claiming…" : "Claim order"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
