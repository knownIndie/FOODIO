import "server-only"
import { Ratelimit } from "@upstash/ratelimit"
import type { RateLimiter } from "./rate-limiter"
import { getHostedRedis } from "./redis"

function createLoginEmailLimiter(): RateLimiter {
  return new Ratelimit({
    redis: getHostedRedis(),
    limiter: Ratelimit.slidingWindow(5, "30 m"),
    prefix: "foodio:login:email",
  })
}

export const loginEmailLimiter = createLoginEmailLimiter()
