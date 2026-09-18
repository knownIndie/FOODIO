import { UtensilsCrossedIcon } from "lucide-react"
import Link from "next/link"
import { containerWidth } from "@/components/extras/classname-extras"
import { cn } from "@/lib/utils"

const footerLinks = [
  {
    title: "Customers",
    links: [
      { label: "Browse food", href: "/" },
      { label: "Create an account", href: "/signup" },
      { label: "Customer login", href: "/login/customer" },
    ],
  },
  {
    title: "Restaurant owners",
    links: [
      { label: "Register your restaurant", href: "/signup/restraurant" },
      { label: "Plans and pricing", href: "/pricing" },
      { label: "Restaurant owner login", href: "/login/restaurant" },
    ],
  },
  {
    title: "Delivery partners",
    links: [
      { label: "Join as a delivery partner", href: "/signup/delivery" },
      { label: "Delivery partner login", href: "/login/delivery" },
      { label: "About partnering with us", href: "/partnerOnboarding" },
    ],
  },
] as const

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className={cn(containerWidth, "py-10 sm:py-12")}>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Link
              href="/"
              aria-label="FoodIO home"
              className="inline-flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <UtensilsCrossedIcon className="size-4" aria-hidden="true" />
              </span>
              <span className="font-heading text-xl font-semibold tracking-tight">
                Food<span className="text-primary">IO</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-muted-foreground">
              Discover food from local kitchens, or join the people behind your
              next meal.
            </p>
            <Link
              href="/partnerOnboarding"
              className="mt-4 inline-block rounded-sm text-sm font-medium underline underline-offset-4 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Become a partner
            </Link>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold">{group.title}</h2>
                <ul className="mt-3 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block rounded-sm py-2 text-sm leading-5 text-muted-foreground transition-colors hover:text-foreground hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} FoodIO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
