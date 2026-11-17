"use client"

import type * as React from "react"
import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "@/components/ui/team-switcher"
import type { NavItem } from "@/lib/navigation/nav-config"
import type { currentProfileType } from "@/lib/types/type"

// The menu comes from the caller (see lib/navigation/nav-config.tsx),
// so admin and restaurant areas can share this component.
export function AppSidebar({
  profile,
  navMain,
  navLabel,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  profile: currentProfileType
  navMain: NavItem[]
  navLabel?: string
}) {
  const { name, email } = profile

  const data = {
    user: {
      name,
      email,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} label={navLabel} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
