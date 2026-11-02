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
    <footer className="mt-auto bg-[#1f2125] text-zinc-400">
      <div className={cn(containerWidth, "max-w-6xl py-12 sm:py-14")}>
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Link
              href="/"
              aria-label="FoodIO home"
              className="inline-block rounded-sm font-heading text-2xl font-extrabold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Food<span className="text-brand-orange">IO</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6">
              Discover food from local kitchens, or join the people behind your
              next meal.
            </p>
            <Link
              href="/partnerOnboarding"
              className="mt-4 inline-block rounded-sm text-sm font-medium text-brand-orange underline underline-offset-4 hover:text-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Become a partner
            </Link>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white">
                  {group.title}
                </h2>
                <ul className="mt-3 space-y-1">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-block rounded-sm py-1.5 text-sm leading-5 transition-colors hover:text-white hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
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

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} FoodIO</p>
          <p>Made in India</p>
        </div>
      </div>
    </footer>
  )
}
