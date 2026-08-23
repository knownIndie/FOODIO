export type RateLimitResult = {
  success: boolean
  reset: number
}

export interface RateLimiter {
  limit(identifier: string): Promise<RateLimitResult>
}
