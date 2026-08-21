import { ShieldCheckIcon } from "lucide-react"
import { LoginPageShell } from "@/components/auth/login-page-shell"

export default function AdminLoginPage() {
  return (
    <LoginPageShell
      badge="Restricted access"
      title="FoodIO admin login"
      description="Only accounts with administrator access can continue."
      endpoint="/api/login/admin"
      destination="/dashboard/admin"
      signupHref={null}
      testDetails={null}
      icon={ShieldCheckIcon}
    />
  )
}
