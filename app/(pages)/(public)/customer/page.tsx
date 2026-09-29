import { MenuItemCard } from "@/components/menu/components/menu-item-card"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getDemoHomeData } from "@/lib/demo-home-data/get-demo-home-data"

export default async function CustomerPage() {
  const demoHomeData = await getDemoHomeData()

  return (
    <>
      {demoHomeData ? (
        <>
          <section className="max-w-3xl space-y-3">
            <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Food Delivery Restaurants{" "}
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose among our selected menu items.
            </p>
            {/*<p className="text-sm text-muted-foreground">

            </p>*/}
          </section>

          <section aria-labelledby="demo-menu-heading" className="space-y-4">
            <div>
              <h2
                id="demo-menu-heading"
                className="font-heading text-2xl font-semibold tracking-tight"
              >
                Today&apos;s Selected Menu
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {demoHomeData.items.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  restaurant={demoHomeData.restaurant}
                />
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
    </>
  )
}
