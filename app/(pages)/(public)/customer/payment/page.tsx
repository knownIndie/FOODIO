import Link from "next/link"

export default function PaymentPage() {
  return (
    <section className="mx-auto w-full max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold">Payment</h1>
      <p>Payment options are not available yet.</p>
      <Link className="inline-block underline" href="/customer/order/review">
        Back to order review
      </Link>
    </section>
  )
}
