import { SiteHeader } from "@/components/home/site-header"
import { DemoMenuItem } from "@/components/menu/demo-menu-item"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { currentProfile } from "@/lib/auth/current-profile"
import { getDemoHomeData } from "@/lib/demo-home-data/get-demo-home-data"

export default async function CustomerPage() {
  const [profile, demoHomeData] = await Promise.all([
    currentProfile(),
    getDemoHomeData(),
  ])

  return (
    <div className="mx-auto min-h-svh bg-background">
      <SiteHeader profile={profile} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {demoHomeData ? (
          <>
            <section className="max-w-3xl space-y-3">
              <Badge variant="secondary">Demo menu</Badge>
              <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
                {demoHomeData.restaurant.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                {demoHomeData.restaurant.description}
              </p>
              <p className="text-sm text-muted-foreground">
                {demoHomeData.restaurant.address}
              </p>
            </section>

            <section aria-labelledby="demo-menu-heading" className="space-y-4">
              <div>
                <h2
                  id="demo-menu-heading"
                  className="font-heading text-2xl font-semibold tracking-tight"
                >
                  Today&apos;s menu
                </h2>
                <p className="text-muted-foreground">
                  Browse the dishes currently available from FoodIO Kitchen.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {demoHomeData.items.map((item) => (
                  <DemoMenuItem key={item.id} item={item} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>FoodIO Kitchen is not available yet</CardTitle>
              <CardDescription>
                Run the demo data seed to load the customer menu.
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        )}
      </main>
    </div>
  )
}
