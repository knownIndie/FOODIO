import { redirect } from "next/navigation"
import Cart from "@/components/cart/components/cart"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function OrderPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect(
      `/login/customer?returnTo=${encodeURIComponent("/customer/order")}`
    )
  }

  return (
    <div>
      <Cart />
    </div>
  )
}
