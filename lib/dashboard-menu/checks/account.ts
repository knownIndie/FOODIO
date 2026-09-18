import "server-only"

import { currentProfile } from "@/lib/auth/current-profile"
import { MenuCheckError } from "./error"

export async function requireMenuOwnerAccount() {
  // Read the caller from the session, never from the request body.
  const profile = await currentProfile()
  if (!profile) {
    throw new MenuCheckError(401, "Log in before saving menu items.")
  }

  if (!profile.emailVerifiedAt || !profile.roles.includes("RESTAURANT_OWNER")) {
    throw new MenuCheckError(
      403,
      "A verified restaurant owner account is required."
    )
  }

  return profile
}
