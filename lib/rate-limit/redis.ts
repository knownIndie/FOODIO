import "server-only"
import { Redis } from "@upstash/redis"
// default redis export for the whole app
export const redis = Redis.fromEnv()
