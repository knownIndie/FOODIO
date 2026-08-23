import "server-only"
import { Redis } from "@upstash/redis"

let hostedRedis: Redis | undefined

export function getHostedRedis() {
  hostedRedis ??= Redis.fromEnv()
  return hostedRedis
}
