import type { Ratelimit } from "@upstash/ratelimit"

type CheckRateLimitReturnType =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number }

export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<CheckRateLimitReturnType> {
  const { success, limit, remaining, pending, reset } =
    await limiter.limit(identifier)

  if (success) {
    return { allowed: true }
  }
  const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
  return { allowed: false, retryAfterSeconds }
}
