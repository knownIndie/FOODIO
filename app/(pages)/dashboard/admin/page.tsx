import { ShieldCheckIcon } from "lucide-react"
import { redirect } from "next/navigation"
import { PortalPlaceholder } from "@/components/dashboard/portal-placeholder"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function AdminDashboardPage() {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login/admin")
  }

  if (!profile.roles.includes("ADMIN")) {
    redirect("/")
  }

  return (
    <PortalPlaceholder
      label="Admin"
      title="Admin dashboard"
      description="This is the restricted starting page for FoodIO administrators."
      username={profile.username}
      icon={ShieldCheckIcon}
    />
  )
}
