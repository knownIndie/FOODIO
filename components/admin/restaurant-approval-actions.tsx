"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function RestaurantApprovalActions({
  restaurantId,
}: {
  restaurantId: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function updateApproval(action: "approve" | "reject") {
    setError(undefined)
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/admin/restaurants/${restaurantId}/approval`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      )
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Could not update the restaurant status.")
        return
      }

      router.replace("/dashboard/admin")
      router.refresh()
    } catch {
      setError("Could not reach the server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-3 sm:flex sm:justify-end">
      {error ? (
        <p className="text-sm text-destructive sm:mr-auto" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        variant="destructive"
        onClick={() => void updateApproval("reject")}
        disabled={isSubmitting}
      >
        Reject
      </Button>
      <Button
        onClick={() => void updateApproval("approve")}
        disabled={isSubmitting}
      >
        Approve
      </Button>
    </div>
  )
}
