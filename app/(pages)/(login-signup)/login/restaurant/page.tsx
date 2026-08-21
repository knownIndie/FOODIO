import { StoreIcon } from "lucide-react"
import { LoginPageShell } from "@/components/auth/login-page-shell"

export default function RestaurantLoginPage() {
  return (
    <LoginPageShell
      badge="Restaurant owner"
      title="Restaurant partner login"
      description="Log in with an account that has restaurant owner access."
      endpoint="/api/login/restaurant"
      destination="/dashboard"
      signupHref="/signup/restraurant"
      signupLabel="Register as a restaurant owner"
      icon={StoreIcon}
    />
  )
}
