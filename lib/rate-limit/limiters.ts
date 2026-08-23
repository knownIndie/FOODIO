import "server-only"
import { Ratelimit } from "@upstash/ratelimit"
import { getServiceMode } from "@/lib/config/service-mode"
import { LocalRedisSlidingWindowLimiter } from "./local-redis-rate-limiter"
import type { RateLimiter } from "./rate-limiter"
import { getHostedRedis } from "./redis"

function createLoginEmailLimiter(): RateLimiter {
  if (getServiceMode() === "local") {
    return new LocalRedisSlidingWindowLimiter({
      limit: 5,
      prefix: "foodio:login:email",
      windowMilliseconds: 30 * 60 * 1000,
    })
  }

  return new Ratelimit({
    redis: getHostedRedis(),
    limiter: Ratelimit.slidingWindow(5, "30 m"),
    prefix: "foodio:login:email",
  })
}

export const loginEmailLimiter = createLoginEmailLimiter()
