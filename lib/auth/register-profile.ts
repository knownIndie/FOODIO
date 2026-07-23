import "server-only"
import { hash } from "argon2"
import { eq, inArray, or } from "drizzle-orm"
import { db } from "../db/drizzle"
import { profileRoles, profiles, roles } from "../db/schema/schema"
import type { PlatformRole } from "./schema/roles"

type RegisterProfileInput = {
  username: string
  name: string
  email: string
  password: string
  roles: readonly [PlatformRole, ...PlatformRole[]]
  /*
  - this is done to avoid situation where we dont have any role , but a role is must as it decides the login path or the api
  - readonly make sures we cant modify the roles and the readonly[] is an array where PlatformRole is a must i.e. we must have one and we can have more with , ...PlatformRole[]
 */
}

export const registerProfile = async (input: RegisterProfileInput) => {
  const email = input.email.trim().toLowerCase()
  const username = input.username.trim().toLowerCase()
  const name = input.name.trim()
  const requestedRoles = [...new Set(input.roles)]
  const [existingProfile] = await db
    .select({
      email: profiles.email,
      username: profiles.username,
    })
    .from(profiles)
    .where(or(eq(profiles.email, email), eq(profiles.username, username)))
    .limit(1)

  if (existingProfile) {
    throw new Error(
      existingProfile.email === email // if
        ? "EMAIL_ALREADY_EXISTS" // if true
        : "USERNAME_ALREADY_EXISTS" // else -> false
    )
    /*
   - since this is a buisness function we dont do anything related to http
   - we throw errors internally
    */
  }

  const hashedPassword = await hash(input.password)

  return db.transaction(async (tx) => {
    const roleRows = await tx
      .select({ roleId: roles.id, role: roles.role })
      .from(roles)
      .where(inArray(roles.role, requestedRoles))

    if (roleRows.length !== requestedRoles.length) {
      throw new Error("REGISTRATION_ROLE_NOT_SEEDED")
      /*
     this is to make sure that the role requested and the role rows we got is same in quantity as to avoid situation where we for some reason dont have a role requested
      */
    }

    const [createProfile] = await tx
      .insert(profiles)
      .values({ name, username, email, password: hashedPassword })
      .returning({
        id: profiles.id,
        name: profiles.name,
        username: profiles.username,
        email: profiles.email,
      })
    await tx.insert(profileRoles).values(
      roleRows.map((role) => ({
        roleId: role.roleId,
        profileId: createProfile.id,
      }))
    )
    return createProfile
  })
}
