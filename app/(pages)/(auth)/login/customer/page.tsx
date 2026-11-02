import { UserRoundIcon } from "lucide-react"
import { LoginPageShell } from "@/components/auth/login-page-shell"
import { safeReturnTo } from "@/lib/auth/safe-return-to"
import { foodioStudiosDemoDetails } from "@/lib/auth/test-details"

export default async function CustomerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>
}) {
  const { returnTo } = await searchParams

  return (
    <LoginPageShell
      badge="Customer"
      title="Welcome back"
      description="Log in to order food and manage your FoodIO account."
      endpoint="/api/login/customer"
      destination={safeReturnTo(returnTo) ?? "/customer"}
      signupHref="/signup"
      signupLabel="Create a customer account"
      testDetails={foodioStudiosDemoDetails}
      icon={UserRoundIcon}
    />
  )
}
