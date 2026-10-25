import { redirect } from "next/navigation"
import { CheckoutPage } from "@/components/cart/components/checkout-layout"
import { PaymentCheckout } from "@/components/checkout/payment-checkout"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function PaymentPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect(
      `/login/customer?returnTo=${encodeURIComponent("/customer/payment")}`
    )
  }

  return (
    <CheckoutPage
      title="Payment"
      backHref="/customer/order/review"
      backLabel="Back to order review"
    >
      <PaymentCheckout />
    </CheckoutPage>
  )
}
