import { currentProfile } from "@/lib/auth/current-profile"
import { sendEmailVerificationOtp } from "@/lib/auth/email-verification"
import { addProfileRole, registerProfile } from "@/lib/auth/register-profile"
import { registrationVerificationResponse } from "@/lib/auth/registration-verification-response"
import { signupFormSchema } from "@/lib/auth/schema/form-schemas"

const returnTo = "/signup/restraurant"

export async function POST(request: Request) {
  try {
    const profile = await currentProfile()

    if (profile) {
      if (!profile.emailVerifiedAt) {
        let emailSent = true

        try {
          const result = await sendEmailVerificationOtp(profile.id)
          emailSent = result.status === "sent"
        } catch (error) {
          emailSent = false
          console.error("Unable to send verification email:", error)
        }

        return Response.json(
          {
            code: "EMAIL_VERIFICATION_REQUIRED",
            error: "Verify your email before applying as a restaurant owner.",
            emailSent,
            next: `/verify-email?returnTo=${encodeURIComponent(returnTo)}`,
          },
          { status: 403 }
        )
      }

      await addProfileRole(profile.id, "RESTAURANT_OWNER")
      return Response.json(
        {
          message: "Restaurant owner role added successfully.",
          next: "/dashboard",
        },
        { status: 200 }
      )
    }

    const parsed = signupFormSchema.safeParse(
      await request.json().catch(() => null)
    )

    if (!parsed.success) {
      return Response.json(
        {
          error: "Data entered is invalid.",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const registeredProfile = await registerProfile({
      ...parsed.data,
      roles: ["RESTAURANT_OWNER"],
    })

    return registrationVerificationResponse(registeredProfile)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "EMAIL_ALREADY_EXISTS") {
        return Response.json(
          {
            code: "ACCOUNT_ALREADY_EXISTS",
            error:
              "A FoodIO account already exists with this email. Log in to continue joining as a restaurant owner.",
            next: `/login?returnTo=${encodeURIComponent(returnTo)}`,
          },
          { status: 409 }
        )
      }

      if (error.message === "USERNAME_ALREADY_EXISTS") {
        return Response.json(
          {
            code: "USERNAME_ALREADY_EXISTS",
            error: "That username is already taken. Choose another username.",
          },
          { status: 409 }
        )
      }
    }

    console.error("Restaurant registration failed:", error)
    return Response.json(
      { error: "Unable to register your profile." },
      { status: 500 }
    )
  }
}
