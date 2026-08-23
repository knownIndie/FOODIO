"use client"

import { Settings2Icon, TerminalSquareIcon } from "lucide-react"
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
import type { currentProfileType } from "@/lib/types/type"

// This is sample data.

export function AppSidebar({
  profile,
  ...props
}: React.ComponentProps<typeof Sidebar> & { profile: currentProfileType }) {
  const { name, email } = profile

  const data = {
    user: {
      name,
      email,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      // {
      //   name: "Acme Inc",
      //   logo: <GalleryVerticalEndIcon />,
      //   plan: "Enterprise",
      // },
      // {
      //   name: "Acme Corp.",
      //   logo: <AudioLinesIcon />,
      //   plan: "Startup",
      // },
      // {
      //   name: "Evil Corp.",
      //   logo: <TerminalIcon />,
      //   plan: "Free",
      // },
    ],
    navMain: [
      {
        title: "Restraurant",
        url: "",
        icon: <TerminalSquareIcon />,
        isActive: true,
        items: [
          {
            title: "All",
            url: "/dashboard/",
          },
          // {
          //   title: "Starred",
          //   url: "#",
          // },
          // {
          //   title: "Settings",
          //   url: "#",
          // },
        ],
      },
      /*
      {
        title: "placeholder1",
        url: "#",
        icon: <BotIcon />,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "placeholder2",
        url: "#",
        icon: <BookOpenIcon />,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      */
      {
        title: "Settings",
        url: "#",
        icon: <Settings2Icon />,
        items: [
          // {
          //   title: "General",
          //   url: "#",
          // },
          // {
          //   title: "Team",
          //   url: "#",
          // },
          // {
          //   title: "Billing",
          //   url: "#",
          // },
          // {
          //   title: "Limits",
          //   url: "#",
          // },
        ],
      },
    ],
  }
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
