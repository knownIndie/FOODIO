import { AppSidebar } from "@/components/ui/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { NavItem } from "@/lib/navigation/nav-config"
import type { currentProfileType } from "@/lib/types/type"

// Shared shell for every logged-in area: sidebar, header and page content.
// Each area passes its own menu through `navMain`.
export function AppShell({
  profile,
  navMain,
  navLabel,
  children,
}: Readonly<{
  profile: currentProfileType
  navMain: NavItem[]
  navLabel?: string
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <AppSidebar profile={profile} navMain={navMain} navLabel={navLabel} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    {profile.username}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
