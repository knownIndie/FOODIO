import { Settings2Icon, StoreIcon, TerminalSquareIcon } from "lucide-react"

export type NavItem = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: { title: string; url: string }[]
}

// Menu for the normal restaurant dashboard (/dashboard/...)
export const dashboardNav: NavItem[] = [
  {
    title: "Restaurant",
    url: "",
    icon: <TerminalSquareIcon />,
    isActive: true,
    items: [{ title: "All", url: "/dashboard/" }],
  },
  {
    title: "Settings",
    url: "#",
    icon: <Settings2Icon />,
    items: [],
  },
]

// Menu for the admin area (/dashboard/admin/...)
export const adminNav: NavItem[] = [
  {
    title: "Restaurants",
    url: "",
    icon: <StoreIcon />,
    isActive: true,
    items: [{ title: "Review applications", url: "/dashboard/admin" }],
  },
]
