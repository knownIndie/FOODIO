import { NextResponse } from "next/server"
import { clearResponseCookie } from "@/lib/auth/jwt"

export async function POST() {
  const response = NextResponse.json({ success: true })
  clearResponseCookie(response, "foodio_access_token")

  return response
}
