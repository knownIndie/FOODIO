import "server-only"
import { createHmac, randomInt, timingSafeEqual } from "node:crypto"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db/drizzle"
import { emailVerificationOtps, profiles } from "@/lib/db/schema/schema"
import { sendVerificationEmail } from "@/lib/email/mailtrap"

const OTP_EXPIRY_MINUTES = 10
const MAX_FAILED_ATTEMPTS = 5
const RESEND_COOLDOWN_SECONDS = 60

type VerificationResult =
  | { status: "verified" }
  | { status: "already_verified" }
  | { status: "not_found" }
  | { status: "expired" }
  | { status: "invalid"; attemptsRemaining: number }
  | { status: "too_many_attempts" }

function verificationSecret() {
  const secret = process.env.EMAIL_VERIFICATION_SECRET

  if (!secret) {
    throw new Error("EMAIL_VERIFICATION_SECRET_NOT_CONFIGURED")
  }

  return secret
}

function generateOtp() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0")
}

function hashOtp(profileId: number, code: string) {
  return createHmac("sha256", verificationSecret())
    .update(`${profileId}:${code}`)
    .digest("hex")
}

function hashesMatch(expected: string, actual: string) {
  const expectedBuffer = Buffer.from(expected, "hex")
  const actualBuffer = Buffer.from(actual, "hex")

  return (
    expectedBuffer.length === actualBuffer.length &&
    timingSafeEqual(expectedBuffer, actualBuffer)
  )
}

export async function sendEmailVerificationOtp(profileId: number) {
  const [profile] = await db
    .select({
      email: profiles.email,
      emailVerifiedAt: profiles.emailVerifiedAt,
    })
    .from(profiles)
    .where(eq(profiles.id, profileId))
    .limit(1)

  if (!profile) {
    throw new Error("PROFILE_NOT_FOUND")
  }

  if (profile.emailVerifiedAt) {
    return { status: "already_verified" as const }
  }

  const [currentOtp] = await db
    .select({ lastSentAt: emailVerificationOtps.lastSentAt })
    .from(emailVerificationOtps)
    .where(eq(emailVerificationOtps.profileId, profileId))
    .limit(1)

  if (currentOtp) {
    const retryAt = new Date(
      currentOtp.lastSentAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000
    )

    if (retryAt > new Date()) {
      return {
        status: "cooldown" as const,
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((retryAt.getTime() - Date.now()) / 1000)
        ),
      }
    }
  }

  const code = generateOtp()
  const codeHash = hashOtp(profileId, code)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000)

  await db
    .insert(emailVerificationOtps)
    .values({
      profileId,
      codeHash,
      expiresAt,
      failedAttempts: 0,
      createdAt: now,
      lastSentAt: now,
    })
    .onConflictDoUpdate({
      target: emailVerificationOtps.profileId,
      set: {
        codeHash,
        expiresAt,
        failedAttempts: 0,
        createdAt: now,
        lastSentAt: now,
      },
    })

  try {
    await sendVerificationEmail({ email: profile.email, code })
  } catch (error) {
    await db
      .delete(emailVerificationOtps)
      .where(
        and(
          eq(emailVerificationOtps.profileId, profileId),
          eq(emailVerificationOtps.codeHash, codeHash)
        )
      )
    throw error
  }

  return { status: "sent" as const, expiresAt }
}

export async function verifyEmailVerificationOtp(
  profileId: number,
  code: string
): Promise<VerificationResult> {
  return db.transaction(async (tx) => {
    const [profile] = await tx
      .select({ emailVerifiedAt: profiles.emailVerifiedAt })
      .from(profiles)
      .where(eq(profiles.id, profileId))
      .limit(1)

    if (!profile) {
      return { status: "not_found" }
    }

    if (profile.emailVerifiedAt) {
      await tx
        .delete(emailVerificationOtps)
        .where(eq(emailVerificationOtps.profileId, profileId))
      return { status: "already_verified" }
    }

    const [otp] = await tx
      .select()
      .from(emailVerificationOtps)
      .where(eq(emailVerificationOtps.profileId, profileId))
      .limit(1)
      .for("update")

    if (!otp) {
      return { status: "not_found" }
    }

    if (otp.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      return { status: "too_many_attempts" }
    }

    if (otp.expiresAt <= new Date()) {
      await tx
        .delete(emailVerificationOtps)
        .where(eq(emailVerificationOtps.profileId, profileId))
      return { status: "expired" }
    }

    const candidateHash = hashOtp(profileId, code)

    if (!hashesMatch(otp.codeHash, candidateHash)) {
      const failedAttempts = otp.failedAttempts + 1

      await tx
        .update(emailVerificationOtps)
        .set({ failedAttempts })
        .where(eq(emailVerificationOtps.profileId, profileId))

      if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
        return { status: "too_many_attempts" }
      }

      return {
        status: "invalid",
        attemptsRemaining: MAX_FAILED_ATTEMPTS - failedAttempts,
      }
    }

    await tx
      .update(profiles)
      .set({ emailVerifiedAt: new Date() })
      .where(eq(profiles.id, profileId))

    await tx
      .delete(emailVerificationOtps)
      .where(eq(emailVerificationOtps.profileId, profileId))

    return { status: "verified" }
  })
}
