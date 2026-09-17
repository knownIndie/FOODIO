import { redirect } from "next/navigation"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currentProfile } from "@/lib/auth/current-profile"

function safeReturnTo(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/dashboard"
}

function maskEmail(email: string) {
  const [localPart, domain] = email.split("@")
  const visible = localPart.slice(0, Math.min(2, localPart.length))
  return `${visible}${"*".repeat(Math.max(1, localPart.length - visible.length))}@${domain}`
}

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const profile = await currentProfile()
  const { returnTo } = await searchParams
  const destination = safeReturnTo(returnTo)

  if (!profile) {
    redirect(`/login?returnTo=${encodeURIComponent(destination)}`)
  }

  if (profile.emailVerifiedAt) {
    redirect(destination)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Verify your email</CardTitle>
          <CardDescription>
            Enter the code from the FoodIO message in your Mailtrap sandbox.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm
            maskedEmail={maskEmail(profile.email)}
            returnTo={destination}
          />
        </CardContent>
      </Card>
    </main>
  )
}
