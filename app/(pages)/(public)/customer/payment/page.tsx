import { CheckoutPage } from "@/components/cart/components/checkout-layout"
import { PaymentCheckout } from "@/components/checkout/payment-checkout"

export default function PaymentPage() {
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
