import { UtensilsCrossedIcon } from "lucide-react"
import Link from "next/link"
import { containerWidth } from "@/components/classname-extras"
import { AccountMenu } from "@/components/home/account-menu"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type HeaderProfile = {
  email: string
  name: string
  roles: string[]
  username: string
}

function dashboardHref(roles: string[]) {
  if (roles.includes("ADMIN")) {
    return "/dashboard/admin"
  }

  if (roles.includes("RESTAURANT_OWNER")) {
    return "/dashboard"
  }

  if (roles.includes("DELIVERY_PARTNER")) {
    return "/dashboard/delivery"
  }

  return "/"
}

export function SiteHeader({ profile }: { profile: HeaderProfile | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div
        className={cn(
          containerWidth,
          "flex h-16 items-center justify-between gap-6"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <UtensilsCrossedIcon className="size-4" />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Food<span className="text-primary">IO</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            className="transition-colors hover:text-foreground"
            href="#portals"
          >
            Choose a portal
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/signup/restraurant"
          >
            For restaurants
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/signup/delivery"
          >
            Deliver with us
          </Link>
          <Link
            className="transition-colors hover:text-foreground"
            href="/pricing"
          >
            Pricing
          </Link>
        </nav>

        {profile ? (
          <AccountMenu
            dashboardHref={dashboardHref(profile.roles)}
            email={profile.email}
            name={profile.name}
            username={profile.username}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Button
              nativeButton={false}
              variant="ghost"
              render={<Link href="/login/customer" />}
            >
              Log in
            </Button>
            <Button nativeButton={false} render={<Link href="/signup" />}>
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
