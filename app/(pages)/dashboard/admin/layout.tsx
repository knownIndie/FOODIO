import { AppShell } from "@/components/layout/app-shell"
import { requireAdmin } from "@/lib/auth/require-admin"
import { adminNav } from "@/lib/navigation/nav-config"

// Admin area: same shell as the dashboard, but with the admin menu.
// Sits outside the (workspace) group, so the dashboard layout does not wrap it.
export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const profile = await requireAdmin()

  return (
    <AppShell profile={profile} navMain={adminNav} navLabel="Admin">
      {children}
    </AppShell>
  )
}
