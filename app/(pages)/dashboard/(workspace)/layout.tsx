import { redirect } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"
import { currentProfile } from "@/lib/auth/current-profile"
import { dashboardNav } from "@/lib/navigation/nav-config"

// Normal restaurant dashboard: every route inside (workspace) gets this shell.
// The (workspace) folder name is not part of the URL.
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await currentProfile()

  if (!profile) {
    redirect("/login")
  }

  if (!profile.emailVerifiedAt) {
    redirect("/verify-email?returnTo=/dashboard")
  }

  return (
    <AppShell profile={profile} navMain={dashboardNav}>
      {children}
    </AppShell>
  )
}
