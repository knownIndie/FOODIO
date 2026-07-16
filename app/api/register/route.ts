import { hash } from "argon2"
import { eq, or } from "drizzle-orm"

import { signupFormSchema } from "@/lib/auth/schema/form-schemas"
import { db } from "@/lib/db/drizzle"
import { profiles } from "@/lib/db/schema/schema"

export async function POST(request: Request) {
  const parsed = signupFormSchema.safeParse(
    await request.json().catch(() => null)
  )

  if (!parsed.success) {
    return Response.json(
      {
        error: "Check the submitted fields.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  const { name, email, password } = parsed.data
  const username = parsed.data.username.toLowerCase()
  const [existingProfile] = await db
    .select({ email: profiles.email, username: profiles.username })
    .from(profiles)
    .where(or(eq(profiles.email, email), eq(profiles.username, username)))
    .limit(1)

  if (existingProfile) {
    const duplicate = existingProfile.email === email ? "email" : "username"
    return Response.json(
      { error: `That ${duplicate} is already registered.` },
      { status: 409 }
    )
  }

  const passwordHash = await hash(password)
  const [profile] = await db
    .insert(profiles)
    .values({ name, username, email, password: passwordHash })
    .returning({
      id: profiles.id,
      name: profiles.name,
      username: profiles.username,
      email: profiles.email,
    })

  return Response.json({ profile }, { status: 201 })
}
