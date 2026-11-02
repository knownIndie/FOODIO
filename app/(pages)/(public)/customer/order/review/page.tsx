import { redirect } from "next/navigation"
import OrderReview from "@/components/cart/components/order-review"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function ReviewPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect(
      `/login/customer?returnTo=${encodeURIComponent("/customer/order/review")}`
    )
  }

  return <OrderReview />
}
