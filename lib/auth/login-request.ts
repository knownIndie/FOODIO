import "server-only"

import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"
import { db } from "@/lib/db/drizzle"
import { profileRoles, roles } from "@/lib/db/schema/schema"
import { checkRateLimit } from "@/lib/rate-limit/check-rate-limit"
import { createEmailRateLimitIdentifier } from "@/lib/rate-limit/identifier"
import { loginEmailLimiter } from "@/lib/rate-limit/limiters"
import { setResponseCookie, signAccessToken } from "./jwt"
import { loginProfile } from "./login-profile"
import { loginFormSchema } from "./schema/form-schemas"
import type { PlatformRole } from "./schema/roles"

type LoginRequestOptions = {
  destination: string
  portalName: string
  requiredRole: PlatformRole
}

async function profileHasRole(profileId: number, requiredRole: PlatformRole) {
  const [roleMatch] = await db
    .select({ roleId: profileRoles.roleId })
    .from(profileRoles)
    .innerJoin(roles, eq(profileRoles.roleId, roles.id))
    .where(
      and(eq(profileRoles.profileId, profileId), eq(roles.role, requiredRole))
    )
    .limit(1)

  return Boolean(roleMatch)
}

export async function handleLoginRequest(
  request: Request,
  options: LoginRequestOptions
) {
  const parsed = loginFormSchema.safeParse(
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

  try {
    const identifier = createEmailRateLimitIdentifier(parsed.data.email)
    const decision = await checkRateLimit(loginEmailLimiter, identifier)

    if (!decision.allowed) {
      return Response.json(
        {
          code: "LOGIN_RATE_LIMITED",
          error: "Too many login attempts. Try again later.",
          retryAfterSeconds: decision.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": decision.retryAfterSeconds.toString(),
          },
        }
      )
    }

    const profile = await loginProfile(parsed.data)
    const hasRequiredRole = await profileHasRole(
      profile.id,
      options.requiredRole
    )

    if (!hasRequiredRole) {
      return Response.json(
        {
          code: "LOGIN_ROLE_REQUIRED",
          error: `This account does not have ${options.portalName} access.`,
        },
        { status: 403 }
      )
    }

    const token = await signAccessToken(profile.id)
    const response = NextResponse.json(
      {
        success: true,
        profile,
        verificationRequired: !profile.emailVerifiedAt,
        next: profile.emailVerifiedAt ? options.destination : "/verify-email",
      },
      { status: 200 }
    )

    setResponseCookie(token, response, "foodio_access_token")
    return response
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_CREDENTIALS") {
      return Response.json(
        { error: "Email or password is incorrect." },
        { status: 401 }
      )
    }

    console.error(`${options.portalName} login failed:`, error)
    return Response.json(
      { error: "Unable to log in right now." },
      { status: 500 }
    )
  }
}
