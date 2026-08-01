import { currentProfile } from "@/lib/auth/current-profile"
import { sendEmailVerificationOtp } from "@/lib/auth/email-verification"

export async function POST() {
  const profile = await currentProfile()

  if (!profile) {
    return Response.json({ error: "Unauthorized." }, { status: 401 })
  }

  if (profile.emailVerifiedAt) {
    return Response.json(
      { success: true, alreadyVerified: true },
      { status: 200 }
    )
  }

  try {
    const result = await sendEmailVerificationOtp(profile.id)

    if (result.status === "cooldown") {
      return Response.json(
        {
          code: "OTP_RESEND_COOLDOWN",
          error: `Wait ${result.retryAfterSeconds} seconds before requesting another code.`,
          retryAfterSeconds: result.retryAfterSeconds,
        },
        {
          status: 429,
          headers: { "Retry-After": result.retryAfterSeconds.toString() },
        }
      )
    }

    return Response.json(
      {
        success: true,
        expiresAt: result.status === "sent" ? result.expiresAt : undefined,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Verification email send failed:", error)
    return Response.json(
      {
        code: "VERIFICATION_EMAIL_SEND_FAILED",
        error:
          "The verification email could not be sent. Check the Mailtrap sandbox configuration and try again.",
      },
      { status: 503 }
    )
  }
}
