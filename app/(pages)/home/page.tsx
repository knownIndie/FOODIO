import {
  BikeIcon,
  Clock3Icon,
  MapPinIcon,
  ShieldCheckIcon,
  StoreIcon,
  UserRoundIcon,
  UtensilsIcon,
} from "lucide-react"
import Link from "next/link"
import { SiteHeader } from "@/components/home/site-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { currentProfile } from "@/lib/auth/current-profile"

const portals = [
  {
    title: "Customer",
    description: "Order from restaurants and manage your FoodIO account.",
    icon: UserRoundIcon,
    actions: [
      { label: "Log in", href: "/login/customer", primary: true },
      { label: "Sign up", href: "/signup", primary: false },
    ],
  },
  {
    title: "Restaurant owner",
    description: "Manage your restaurant setup, menu, and account.",
    icon: StoreIcon,
    actions: [
      { label: "Log in", href: "/login/restaurant", primary: true },
      {
        label: "Register restaurant",
        href: "/signup/restraurant",
        primary: false,
      },
    ],
  },
  {
    title: "Delivery partner",
    description: "Enter the delivery portal with your partner account.",
    icon: BikeIcon,
    actions: [
      { label: "Log in", href: "/login/delivery", primary: true },
      { label: "Sign up", href: "/signup/delivery", primary: false },
    ],
  },
  {
    title: "Admin",
    description: "Restricted access for FoodIO administrators.",
    icon: ShieldCheckIcon,
    badge: "Restricted access",
    actions: [{ label: "Admin login", href: "/login/admin", primary: true }],
  },
]

export default async function HomePage() {
  const profile = await currentProfile()

  return (
    <div className="min-h-svh bg-background">
      <SiteHeader profile={profile} />

      <main>
        <section
          id="portals"
          className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
        >
          <div className="mb-8 max-w-2xl space-y-2">
            <p className="text-sm font-medium text-primary">FoodIO access</p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight">
              Choose how you use FoodIO
            </h2>
            <p className="text-muted-foreground">
              Each login checks the role attached to your account before opening
              its dashboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {portals.map((portal) => {
              const Icon = portal.icon

              return (
                <Card key={portal.title} className="h-full border-border/70">
                  <CardHeader className="gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      {portal.badge && (
                        <Badge variant="destructive">{portal.badge}</Badge>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <CardTitle className="text-lg">{portal.title}</CardTitle>
                      <CardDescription>{portal.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-auto grid gap-2">
                    {portal.actions.map((action) => (
                      <Button
                        key={action.href}
                        nativeButton={false}
                        variant={action.primary ? "default" : "outline"}
                        render={<Link href={action.href} />}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-8">
        <p className="text-center text-sm text-muted-foreground">
          FoodIO demo marketplace
        </p>
      </footer>
    </div>
  )
}
