import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"

// razorpay signs `${order_id}|${payment_id}` with the key secret, as lowercase hex
// the same check works for webhooks, with a different payload and secret
export function isValidRazorpaySignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expected = createHmac("sha256", secret).update(payload).digest("hex")

  const expectedBuffer = Buffer.from(expected, "utf8")
  const signatureBuffer = Buffer.from(signature, "utf8")

  if (expectedBuffer.length !== signatureBuffer.length) return false

  return timingSafeEqual(expectedBuffer, signatureBuffer)
}
