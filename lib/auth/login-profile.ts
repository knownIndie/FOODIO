import "server-only"
import { verify } from "argon2"
import { eq } from "drizzle-orm"

import { db } from "@/lib/db/drizzle"
import { profiles } from "@/lib/db/schema/schema"

type loginInputType = {
  email: string
  password: string
}

export const loginProfile = async (input: loginInputType) => {
  const email = input.email.trim().toLowerCase()

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email))
    .limit(1)

  const passwordMatches = profile
    ? await verify(profile.password, input.password).catch(() => false)
    : false

  if (!profile || !passwordMatches) {
    throw new Error("INVALID_CREDENTIALS")
  }

  return {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    email: profile.email,
  }
}
