import { randomUUID } from "node:crypto"
import { createClient } from "redis"
import type { RateLimiter, RateLimitResult } from "./rate-limiter"

const SLIDING_WINDOW_SCRIPT = `
local time = redis.call("TIME")
local now = (tonumber(time[1]) * 1000) + math.floor(tonumber(time[2]) / 1000)
local window_start = now - tonumber(ARGV[1])

redis.call("ZREMRANGEBYSCORE", KEYS[1], "-inf", window_start)

local count = redis.call("ZCARD", KEYS[1])
if count >= tonumber(ARGV[2]) then
  local oldest = redis.call("ZRANGE", KEYS[1], 0, 0, "WITHSCORES")
  return {0, tonumber(oldest[2]) + tonumber(ARGV[1])}
end

redis.call("ZADD", KEYS[1], now, ARGV[3])
redis.call("PEXPIRE", KEYS[1], tonumber(ARGV[1]))

return {1, now + tonumber(ARGV[1])}
`

type LocalRedisClient = ReturnType<typeof createClient>

type LocalRedisState = {
  client?: LocalRedisClient
  connection?: Promise<unknown>
}

const globalForRedis = globalThis as typeof globalThis & {
  foodioLocalRedis?: LocalRedisState
}

function redisState() {
  globalForRedis.foodioLocalRedis ??= {}
  return globalForRedis.foodioLocalRedis
}

async function connectedRedisClient() {
  const state = redisState()

  if (!state.client) {
    const redisUrl = process.env.REDIS_URL
    if (!redisUrl) throw new Error("REDIS_URL is not set in local mode")

    state.client = createClient({ url: redisUrl })
    state.client.on("error", (error) => {
      console.error("Local Redis connection error:", error)
    })
  }

  if (!state.client.isOpen) {
    state.connection ??= state.client.connect().catch((error) => {
      state.connection = undefined
      throw error
    })
    await state.connection
  }

  return state.client
}

export async function closeLocalRedisConnection() {
  const state = globalForRedis.foodioLocalRedis

  if (state?.client?.isOpen) {
    await state.client.quit()
  }

  delete globalForRedis.foodioLocalRedis
}

type LocalSlidingWindowOptions = {
  limit: number
  prefix: string
  windowMilliseconds: number
}

export class LocalRedisSlidingWindowLimiter implements RateLimiter {
  private readonly limitCount: number
  private readonly prefix: string
  private readonly windowMilliseconds: number

  constructor(options: LocalSlidingWindowOptions) {
    this.limitCount = options.limit
    this.prefix = options.prefix
    this.windowMilliseconds = options.windowMilliseconds
  }

  async limit(identifier: string): Promise<RateLimitResult> {
    const client = await connectedRedisClient()
    const result = await client.eval(SLIDING_WINDOW_SCRIPT, {
      arguments: [
        this.windowMilliseconds.toString(),
        this.limitCount.toString(),
        `${Date.now()}:${randomUUID()}`,
      ],
      keys: [`${this.prefix}:${identifier}`],
    })

    if (!Array.isArray(result) || result.length !== 2) {
      throw new Error("Local Redis returned an invalid rate-limit result")
    }

    return {
      success: Number(result[0]) === 1,
      reset: Number(result[1]),
    }
  }
}
