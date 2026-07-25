import { currentProfile } from "@/lib/auth/current-profile"
// verify the access token and return the user profile
export async function GET() {
  const currentUserProfile = await currentProfile()
  if (!currentUserProfile) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  return Response.json(
    { authentication: true, profile: currentUserProfile },
    { status: 200 }
  )
}
