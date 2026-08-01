import { currentProfile } from "@/lib/auth/current-profile"
import { verifyEmailVerificationOtp } from "@/lib/auth/email-verification"
import { emailVerificationCodeSchema } from "@/lib/auth/schema/form-schemas"

export async function POST(request: Request) {
  const profile = await currentProfile()

  if (!profile) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  const parsed = emailVerificationCodeSchema.safeParse(
    await request.json().catch(() => null)
  )

  if (!parsed.success) {
    return Response.json(
      {
        error: "Enter a valid six-digit verification code.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    )
  }

  try {
    const result = await verifyEmailVerificationOtp(
      profile.id,
      parsed.data.code
    )

    if (result.status === "verified" || result.status === "already_verified") {
      return Response.json({ success: true, verified: true }, { status: 200 })
    }

    if (result.status === "invalid") {
      return Response.json(
        {
          code: "INVALID_OTP",
          error: `That code is incorrect. ${result.attemptsRemaining} attempts remaining.`,
          attemptsRemaining: result.attemptsRemaining,
        },
        { status: 400 }
      )
    }

    if (result.status === "expired") {
      return Response.json(
        {
          code: "OTP_EXPIRED",
          error: "That code has expired. Request a new one.",
        },
        { status: 410 }
      )
    }

    if (result.status === "too_many_attempts") {
      return Response.json(
        {
          code: "OTP_ATTEMPTS_EXHAUSTED",
          error: "Too many incorrect attempts. Request a new code.",
        },
        { status: 429 }
      )
    }

    return Response.json(
      {
        code: "OTP_NOT_FOUND",
        error: "No active verification code was found. Request a new one.",
      },
      { status: 404 }
    )
  } catch (error) {
    console.error("Email verification failed:", error)
    return Response.json(
      { error: "Unable to verify your email." },
      { status: 500 }
    )
  }
}
