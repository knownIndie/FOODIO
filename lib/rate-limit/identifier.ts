import "server-only"
import { createHmac } from "node:crypto"

function rateLimitSecretReader() {
  const rateLimitSecret = process.env.RATE_LIMIT_SECRET
  if (!rateLimitSecret) throw new Error("RATE_LIMIT_SECRET_NOT_CONFIGURED")
  return rateLimitSecret
}

export function createEmailRateLimitIdentifier(email: string): string {
  // this is so we dont leak or use the actual email or send it anywher , we store it in redis so no email leak 
  const normalizedEmail = email.trim().toLowerCase()
  const hmac = createHmac("sha256", rateLimitSecretReader())
  const hmacEmail = hmac.update(normalizedEmail).digest("hex")
  return hmacEmail
}
