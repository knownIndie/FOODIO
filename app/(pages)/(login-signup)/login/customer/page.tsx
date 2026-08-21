import { UserRoundIcon } from "lucide-react"
import { LoginPageShell } from "@/components/auth/login-page-shell"
import { customerTestDetails } from "@/lib/auth/test-details"

export default function CustomerLoginPage() {
  return (
    <LoginPageShell
      badge="Customer"
      title="Welcome back"
      description="Log in to order food and manage your FoodIO account."
      endpoint="/api/login/customer"
      destination="/"
      signupHref="/signup"
      signupLabel="Create a customer account"
      testDetails={customerTestDetails}
      icon={UserRoundIcon}
    />
  )
}
