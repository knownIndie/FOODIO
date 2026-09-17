import { BikeIcon } from "lucide-react"
import { LoginPageShell } from "@/components/auth/login-page-shell"

export default function DeliveryLoginPage() {
  return (
    <LoginPageShell
      badge="Delivery partner"
      title="Delivery partner login"
      description="Log in with an account that has delivery partner access."
      endpoint="/api/login/delivery"
      destination="/dashboard/delivery"
      signupHref="/signup/delivery"
      signupLabel="Become a delivery partner"
      icon={BikeIcon}
    />
  )
}
