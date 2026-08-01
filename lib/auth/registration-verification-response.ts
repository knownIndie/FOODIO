import "server-only"
import { NextResponse } from "next/server"
import { sendEmailVerificationOtp } from "./email-verification"
import { setResponseCookie, signAccessToken } from "./jwt"

type RegisteredProfile = {
  id: number
  name: string
  username: string
  email: string
}

export async function registrationVerificationResponse(
  profile: RegisteredProfile,
  status = 201
) {
  let emailSent = true

  try {
    await sendEmailVerificationOtp(profile.id)
  } catch (error) {
    emailSent = false
    console.error("Unable to send verification email:", error)
  }

  const token = await signAccessToken(profile.id)
  const response = NextResponse.json(
    {
      success: true,
      profile,
      verificationRequired: true,
      emailSent,
      next: "/verify-email",
    },
    { status }
  )

  setResponseCookie(token, response, "foodio_access_token")
  return response
}
