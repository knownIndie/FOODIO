import { redirect } from "next/navigation"
import type { JSX } from "react/jsx-runtime"
import { SignupForm } from "@/components/auth/signup-form"
import { DeliveryRegistrationButton } from "@/components/login-signup/DeliveryRegistrationButton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currentProfile } from "@/lib/auth/current-profile"

// default customer signup page
export default async function SignupPage() {
  const profile = await currentProfile()
  let content: JSX.Element
  if (!profile) {
    content = <SignupForm endpoint="/api/register/delivery" />
  } else if (!profile.emailVerifiedAt) {
    redirect(`/verify-email?returnTo=${encodeURIComponent("/signup/delivery")}`)
  } else if (profile.roles.includes("DELIVERY_PARTNER")) {
    content = <p>You already have delivery partner access.</p>

    redirect("/")
  } else {
    content = <DeliveryRegistrationButton endpoint="/api/register/delivery" />
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join FoodIO as a delivery partner</CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </main>
  )
}
