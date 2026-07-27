import { redirect } from "next/navigation"
import type { JSX } from "react/jsx-runtime"
import { SignupForm } from "@/components/auth/signup-form"
import { RestaurantRegistrationButton } from "@/components/login-signup/RestaurantRegistrationButton"
import { Button } from "@/components/ui/button"
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
    content = <SignupForm endpoint="/api/register/restraurant" />
  } else if (profile.roles.includes("RESTAURANT_OWNER")) {
    content = <p>You already have restaurant owner access.</p>

    redirect("/")
  } else {
    content = (
      <RestaurantRegistrationButton endpoint="/api/register/restraurant" />
    )
  }
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Join FoodIO as a user or restaurant owner.
          </CardDescription>
        </CardHeader>
        <CardContent>{content}</CardContent>
      </Card>
    </main>
  )
}
