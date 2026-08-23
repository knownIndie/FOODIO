import type { RateLimiter } from "./rate-limiter"

type CheckRateLimitReturnType =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

export async function checkRateLimit(
  limiter: RateLimiter,
  identifier: string
): Promise<CheckRateLimitReturnType> {
  const { success, reset } = await limiter.limit(identifier)

  if (success) {
    return { allowed: true }
  }
  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  return { allowed: false, retryAfterSeconds }
}
