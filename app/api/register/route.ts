import { registerProfile } from "@/lib/auth/register-profile"
import { registrationVerificationResponse } from "@/lib/auth/registration-verification-response"
import { signupFormSchema } from "@/lib/auth/schema/form-schemas"

export async function POST(request: Request) {
  const parsed = signupFormSchema.safeParse(
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
    const profile = await registerProfile({
      ...parsed.data,
      roles: ["CUSTOMER"],
    })
    return registrationVerificationResponse(profile)
  } catch (error) {
    if (error instanceof Error) {
      /*
        the error can be anything, but to access the error message we need to know it's actually an Error object. that's why we check instanceof Error first, so we don't crash trying to read .message on something like a string or undefined 
      */
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return Response.json(
          {
            code: "ACCOUNT_ALREADY_EXISTS",
            error:
              "A FoodIO account already exists with this email. Log in instead.",
            next: "/login",
          },
          { status: 409 }
        )
      } else if (error.message === "USERNAME_ALREADY_EXISTS") {
        return Response.json(
          {
            code: "USERNAME_ALREADY_EXISTS",
            error: "That username is already registered.",
          },
          { status: 409 }
        )
      }
    }
    console.error("Customer registration failed:", error)

    return Response.json(
      { error: "Unable to register your profile." },
      { status: 500 }
    )
  }
}
