import "server-only"
import { redirect } from "next/navigation"
import { currentProfile } from "./current-profile"

// For pages and layouts only. Redirects instead of returning a response.
// API routes should check `profile.roles.includes("ADMIN")` themselves and return JSON.
export async function requireAdmin() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login/admin")
  }

  if (!profile.emailVerifiedAt) {
    redirect("/verify-email?returnTo=/dashboard/admin")
  }

  if (!profile.roles.includes("ADMIN")) {
    redirect("/")
  }

  return profile
}
