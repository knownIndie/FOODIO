import "server-only"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import { db } from "../db/drizzle"
import { profileRoles, profiles, roles } from "../db/schema/schema"
import { verifyAccessToken } from "./jwt"

export async function currentProfile() {
  const cookieStore = await cookies()
  const token = cookieStore.get("foodio_access_token")?.value

  if (!token) {
    return null
  }

  const isVerified = await verifyAccessToken(token)

  if (!isVerified.authentication) {
    return null
  }
  const profileId = isVerified.profileId

  const [profile] = await db
    .select({
      // select only the fields we need
      id: profiles.id,
      name: profiles.name,
      username: profiles.username,
      email: profiles.email,
    })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1)

  if (!profile) {
    return null
  }

  const profileCurrentRoles = await db
    .select({ role: roles.role })
    .from(profileRoles)
    .innerJoin(roles, eq(profileRoles.roleId, roles.id))
    .where(eq(profileRoles.profileId, profileId))
  return {
    id: profile.id,
    username: profile.username,
    roles: profileCurrentRoles.map((row) => row.role),
    email: profile.email,
    name: profile.name,
  }
}
