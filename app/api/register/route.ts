import { hash } from "argon2"
import { or, eq } from "drizzle-orm"

import { signupSchema } from "@/lib/auth/schema"
import { db } from "@/lib/db/drizzle"
import { profiles } from "@/lib/db/schema/schema"

export async function POST(request: Request) {
  const result = signupSchema.safeParse(await request.json().catch(() => null))

  if (!result.success) {
    return Response.json(
      { error: "Check the submitted fields.", fields: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { name, username, email, password, role } = result.data
  const normalizedUsername = username.toLowerCase()

  const [existingProfile] = await db
    .select({ email: profiles.email, username: profiles.username })
    .from(profiles)
    .where(
      or(
        eq(profiles.email, email),
        eq(profiles.username, normalizedUsername)
      )
    )
    .limit(1)

  if (existingProfile) {
    const field = existingProfile.email === email ? "email" : "username"
    return Response.json(
      { error: `That ${field} is already registered.` },
      { status: 409 }
    )
  }

  const passwordHash = await hash(password)
  const [profile] = await db
    .insert(profiles)
    .values({
      name,
      username: normalizedUsername,
      email,
      passwordHash,
      role,
    })
    .returning({
      id: profiles.id,
      name: profiles.name,
      username: profiles.username,
      email: profiles.email,
      role: profiles.role,
    })

  return Response.json({ profile }, { status: 201 })
}
