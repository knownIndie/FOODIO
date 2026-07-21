import { loginProfile } from "@/lib/auth/login-profile"
import { loginFormSchema } from "@/lib/auth/schema/form-schemas"

export async function POST(request: Request) {
  const parsed = loginFormSchema.safeParse(
    await request.json().catch(() => null) // it tries to parse the request body as json, if it fails then it catches the error and returns null instead
  )

  if (!parsed.success) {
    return Response.json(
      {
        error: "data entered is invalid",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  try {
    const profile = await loginProfile(parsed.data)
    console.log(
      `Login successfully for the user ${profile.username} with email:${profile.email}`
    )
    return Response.json({ profile }, { status: 200 })
  } catch (error) {
    if (error instanceof Error) {
      /*
      the error can be anything, but to access the error message we need to know it's actually an Error object. that's why we check instanceof Error first, so we don't crash trying to read .message on something like a string or undefined */
      if (error.message === "INVALID_CREDENTIALS") {
        return Response.json(
          { error: "Email or password is incorrect." },
          { status: 401 }
        )
      }
    }
    console.error("couldn't login", error)

    return Response.json(
      { error: "Unable to login your profile." },
      { status: 500 }
    )
  }
}
