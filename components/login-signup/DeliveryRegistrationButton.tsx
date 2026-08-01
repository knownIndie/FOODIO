"use client"

import { useRouter } from "next/navigation"
import type { SignupEndpoint } from "../auth/signup-form"
import { Button } from "../ui/button"

export function DeliveryRegistrationButton({ endpoint }: SignupEndpoint) {
  const router = useRouter()
  const handleClick = async () => {
    const response = await fetch(endpoint, { method: "POST" })
    const data = (await response.json()) as { next?: string }
    if (!response.ok) {
      if (data.next) {
        router.replace(data.next)
      }
      return
    }
    router.replace(data.next ?? "/dashboard")
  }

  return (
    <Button onClick={handleClick}>
      Apply for FoodIO Delivery Partner Account
    </Button>
  )
}
