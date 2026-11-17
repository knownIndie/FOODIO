"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

// Re-renders the server page once, at `at` (an ISO time), so a delivery status
// that is due to change shows up without the user reloading.
export function RefreshAt({ at }: { at: string | null }) {
  const router = useRouter()

  useEffect(() => {
    if (!at) return
    // small buffer so the server clock is surely past the reveal time
    const delay = Math.max(0, new Date(at).getTime() - Date.now()) + 500
    const timer = setTimeout(() => router.refresh(), delay)
    return () => clearTimeout(timer)
  }, [at, router])

  return null
}
