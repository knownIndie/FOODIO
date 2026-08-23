import assert from "node:assert/strict"
import { randomUUID } from "node:crypto"
import { Pool } from "pg"
import { createClient } from "redis"
import { getServiceMode } from "../lib/config/service-mode"
import {
  sendMailpitVerificationEmail,
  verifyMailpitConnection,
} from "../lib/email/mailpit"
import {
  closeLocalRedisConnection,
  LocalRedisSlidingWindowLimiter,
} from "../lib/rate-limit/local-redis-rate-limiter"

const databaseUrl = process.env.DATABASE_URL
const redisUrl = process.env.REDIS_URL

assert.equal(getServiceMode(), "local")
assert.ok(databaseUrl, "DATABASE_URL is required")
assert.ok(redisUrl, "REDIS_URL is required")

const pool = new Pool({ connectionString: databaseUrl })
const redis = createClient({ url: redisUrl })
const rateLimitIdentifier = `verification-${randomUUID()}`
const rateLimitKey = `foodio:verification:${rateLimitIdentifier}`

try {
  const databaseResult = await pool.query<{
    database_name: string
    postgres_version: string
  }>(
    "select current_database() as database_name, version() as postgres_version"
  )
  assert.equal(databaseResult.rows[0]?.database_name, "foodio")

  await redis.connect()
  assert.equal(await redis.ping(), "PONG")

  await verifyMailpitConnection()

  const limiter = new LocalRedisSlidingWindowLimiter({
    limit: 5,
    prefix: "foodio:verification",
    windowMilliseconds: 30 * 60 * 1000,
  })
  const rateLimitResults = []
  for (let attempt = 0; attempt < 6; attempt += 1) {
    rateLimitResults.push(await limiter.limit(rateLimitIdentifier))
  }

  assert.deepEqual(
    rateLimitResults.map((result) => result.success),
    [true, true, true, true, true, false]
  )
  assert.ok(rateLimitResults[5]?.reset > Date.now())

  if (process.argv.includes("--send-email")) {
    const verificationCode = "482731"
    await sendMailpitVerificationEmail({
      code: verificationCode,
      email: "docker-verification@foodio.test",
    })

    const response = await fetch("http://127.0.0.1:8025/api/v1/messages")
    assert.equal(response.ok, true)
    const mailpitMessages = await response.text()
    assert.match(mailpitMessages, new RegExp(verificationCode))
  }

  console.log(
    "Local verification passed: PostgreSQL, Redis, sliding-window rate limiting, and Mailpit are ready."
  )
} finally {
  if (redis.isOpen) {
    await redis.del(rateLimitKey)
    await redis.quit()
  }
  await closeLocalRedisConnection()
  await pool.end()
}
