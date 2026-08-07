import { Ratelimit } from "@upstash/ratelimit"
import { redis } from "./redis"

export const loginEmailLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "foodio:login:email",
})
