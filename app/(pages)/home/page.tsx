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
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="absolute -top-28 right-0 size-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8">
            <div className="relative max-w-2xl space-y-7">
              <Badge variant="secondary">Food delivery, your way</Badge>
              <div className="space-y-4">
                <h1 className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                  Good food, delivered your way.
                </h1>
                <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                  Find local restaurants, order your favourites, or open the
                  FoodIO portal built for your role.
                </p>
              </div>

              <div className="flex max-w-xl flex-col gap-3 rounded-3xl border bg-card p-3 shadow-sm sm:flex-row">
                <div className="relative flex-1">
                  <MapPinIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    aria-label="Delivery location"
                    className="h-11 border-0 bg-muted/60 pl-10 shadow-none"
                    placeholder="Enter your delivery location"
                  />
                </div>
                <Button
                  nativeButton={false}
                  size="lg"
                  render={<Link href="/login/customer" />}
                >
                  Find food
                </Button>
              </div>
            </div>

            <Card className="relative border-border/70 bg-card/90 shadow-2xl shadow-primary/10">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <UtensilsIcon className="size-5" />
                  </div>
                  <Badge variant="outline">
                    <Clock3Icon data-icon="inline-start" />
                    30 to 45 min
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-2xl">Dinner near you</CardTitle>
                <CardDescription>
                  Browse by cuisine once customer ordering is connected.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {["North Indian", "Biryani", "South Indian", "Desserts"].map(
                  (cuisine) => (
                    <div
                      key={cuisine}
                      className="rounded-2xl border bg-muted/40 p-4 font-medium"
                    >
                      {cuisine}
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="portals"
          className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
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
