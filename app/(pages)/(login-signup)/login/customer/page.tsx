import { UserRoundIcon } from "lucide-react"
import { LoginPageShell } from "@/components/auth/login-page-shell"
import { foodioStudiosDemoDetails } from "@/lib/auth/test-details"

export default function CustomerLoginPage() {
  return (
    <LoginPageShell
      badge="Customer"
      title="Welcome back"
      description="Log in to order food and manage your FoodIO account."
      endpoint="/api/login/customer"
      destination="/customer"
      signupHref="/signup"
      signupLabel="Create a customer account"
      testDetails={foodioStudiosDemoDetails}
      icon={UserRoundIcon}
    />
  )
}
