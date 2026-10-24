export type RazorpayPaymentResult = {
  // The payment result returned by Razorpay
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}
export type RazorpayPaymentFailure = {
  error: {
    code: string
    description: string
    reason: string
    metadata: {
      order_id: string
      payment_id: string
    }
  }
}

type RazorpayCheckoutOptions = {
  // The configuration options required by Razorpay Checkout.
  key: string
  order_id: string
  amount: number
  currency: "INR"
  name: string
  prefill: {
    name: string
    contact: string
  }
  handler: (result: RazorpayPaymentResult) => void
  modal: {
    ondismiss: () => void
  }
}

type RazorpayCheckoutInstance = {
  // instance of the Razorpay checkout and the options that are allowed
  open: () => void
  on: (
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailure) => void
  ) => void // takes 2 arguments one the event that is of type string , ither is the funcion that runs
}

declare global {
  interface Window {
    // extends the Window interface with Razorpay option that will when be called , can make a new instance with the optuions of checkout options and will return use a checkoutInstance
    Razorpay?: new (
      options: RazorpayCheckoutOptions
    ) => RazorpayCheckoutInstance
  }
}
