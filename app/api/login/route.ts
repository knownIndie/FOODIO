import { verify } from "argon2"
import { eq } from "drizzle-orm"

import { loginSchema } from "@/lib/auth/schema"
import { db } from "@/lib/db/drizzle"
import { profiles } from "@/lib/db/schema/schema"

export async function POST(request: Request) {
  const result = loginSchema.safeParse(await request.json().catch(() => null))

  if (!result.success) {
    return Response.json(
      { error: "Check the submitted fields.", fields: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, result.data.email))
    .limit(1)

  const passwordMatches = profile
    ? await verify(profile.passwordHash, result.data.password).catch(() => false)
    : false

  if (!profile || !passwordMatches) {
    return Response.json(
      { error: "Email or password is incorrect." },
      { status: 401 }
    )
  }

  return Response.json({
    profile: {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      email: profile.email,
      role: profile.role,
    },
  })
}
