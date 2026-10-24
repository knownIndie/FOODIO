import {
  ChevronDownIcon,
  HandshakeIcon,
  LinkIcon,
  SearchIcon,
  UserIcon,
  UtensilsCrossedIcon,
} from "lucide-react"
import Link from "next/link"
import { CartLink } from "@/components/customer-homepage/cart-link"
import { AccountMenu } from "@/components/customer-homepage/account-menu"
import {
  containerWidth,
  headerLinkClass,
} from "@/components/extras/classname-extras"
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

export function CustomerHeader({ profile }: { profile: HeaderProfile | null }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div
        className={cn(
          containerWidth,
          "flex h-16 max-w-6xl items-center justify-between gap-6"
        )}
      >
        <div className="flex items-center gap-6">
          <Link
            href="/"
            aria-label="FoodIO home"
            className="flex shrink-0 items-center gap-2 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange text-white">
              <UtensilsCrossedIcon className="size-4" aria-hidden="true" />
            </span>
            <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
              Food<span className="text-brand-orange">IO</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 text-sm md:flex">
            <span className="font-bold">Bengaluru</span>
            <span className="hidden text-muted-foreground xl:inline">
              Karnataka, India
            </span>
            <ChevronDownIcon
              className="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className={cn(headerLinkClass, "hidden sm:inline-flex")}
          >
            <SearchIcon className="size-5" aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Search</span>
          </button>
          <Link
            href="/partnerOnboarding"
            className={cn(headerLinkClass, "hidden md:inline-flex")}
          >
            <HandshakeIcon className="size-5" aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">Partner with us</span>
          </Link>
          <Link
            href="/links"
            className={cn(headerLinkClass, "hidden md:inline-flex")}
          >
            <LinkIcon className="size-5" aria-hidden="true" />
            <span className="sr-only lg:not-sr-only">All Links</span>
          </Link>

          {profile ? (
            <AccountMenu
              dashboardHref={dashboardHref(profile.roles)}
              email={profile.email}
              name={profile.name}
              username={profile.username}
            />
          ) : (
            <>
              <Link href="/login/customer" className={headerLinkClass}>
                <UserIcon className="size-5" aria-hidden="true" />
                <span className="sr-only lg:not-sr-only">Sign in</span>
              </Link>
              <Button
                nativeButton={false}
                size="lg"
                className="rounded-full bg-brand-green px-4 text-white hover:bg-brand-green-hover"
                render={<Link href="/signup" />}
              >
                Sign up
              </Button>
            </>
          )}

          <CartLink />
        </div>
      </div>
    </header>
  )
}

export function RestaurantOwnerHeader({
  profile,
}: {
  profile: HeaderProfile | null
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white">
      <div
        className={cn(
          containerWidth,
          "flex h-16 max-w-6xl items-center justify-between gap-6"
        )}
      >
        <Link
          href="/"
          aria-label="FoodIO home"
          className="flex items-center gap-2 rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-orange text-white">
            <UtensilsCrossedIcon className="size-4" aria-hidden="true" />
          </span>
          <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
            Food<span className="text-brand-orange">IO</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            className="transition-colors hover:text-foreground"
            href="/links"
          >
            login All
          </Link>
          {/*<Link
            className="transition-colors hover:text-foreground"
            href="/signup/restraurant"
          >
            For restaurants
          </Link>*/}
          {/*<Link
            className="transition-colors hover:text-foreground"
            href="/signup/delivery"
          >
            Deliver with us
          </Link>*/}
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
            <Button
              nativeButton={false}
              size="lg"
              className="rounded-full bg-brand-green px-4 text-white hover:bg-brand-green-hover"
              render={<Link href="/signup" />}
            >
              Sign up
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
