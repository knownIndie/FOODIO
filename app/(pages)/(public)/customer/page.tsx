import { BikeIcon, StoreIcon, UserRoundIcon } from "lucide-react"
import Link from "next/link"
import { NearbyRestaurants } from "@/components/customer-homepage/nearby-restaurants"
import { containerWidth } from "@/components/extras/classname-extras"
import { currentProfile } from "@/lib/auth/current-profile"
import { nearlocationData } from "@/lib/home-data/queries"

const DEFAULT_CITY = {
  // label: "Delhi",
  // latitude: 28.6139,
  // longitude: 77.209,
  latitude: 12.9716,
  longitude: 77.5946,
}

export default async function CustomerPage() {
  const profile = await currentProfile()
  const initialRestaurants = await nearlocationData({
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
    readiusFromLocation: 100,
  })

  return (
    <>
      <NearbyRestaurants
        initialRestaurants={initialRestaurants}
        isLoggedIn={profile !== null}
      />

      <section
        aria-labelledby="grow-title"
        className="relative left-1/2 -mb-8 w-screen -translate-x-1/2 bg-page-background py-16"
      >
        <div className={containerWidth}>
          <h2 id="grow-title" className="font-heading text-3xl font-bold">
            Grow with FoodIO
          </h2>
          <p className="mt-2 text-muted-foreground">
            Join the people behind your next meal.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <article className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-2xl bg-brand-orange-soft text-brand-orange"
              >
                <StoreIcon className="size-5" />
              </span>

              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold">
                  Restaurant owners
                </h3>
                <p className="text-sm text-muted-foreground">
                  Register your restaurant, set up your menu and start taking
                  orders.
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <Link
                  href="/signup/restraurant"
                  className="text-brand-orange underline underline-offset-4 hover:text-brand-orange-hover"
                >
                  Register your restaurant
                </Link>
                <Link
                  href="/pricing"
                  className="text-brand-orange underline underline-offset-4 hover:text-brand-orange-hover"
                >
                  Plans and pricing
                </Link>
              </div>
            </article>

            <article className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-2xl bg-emerald-50 text-brand-green"
              >
                <BikeIcon className="size-5" />
              </span>

              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold">
                  Delivery partners
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pick up orders from kitchens in your city and deliver on your
                  own schedule.
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <Link
                  href="/signup/delivery"
                  className="text-brand-green underline underline-offset-4 hover:text-brand-green-hover"
                >
                  Join as a delivery partner
                </Link>
              </div>
            </article>

            <article className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"
              >
                <UserRoundIcon className="size-5" />
              </span>

              <div className="space-y-2">
                <h3 className="font-heading text-lg font-bold">Customers</h3>
                <p className="text-sm text-muted-foreground">
                  Create an account to save your delivery details and reorder
                  faster.
                </p>
              </div>

              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
                <Link
                  href="/signup"
                  className="text-blue-700 underline underline-offset-4 hover:text-blue-800"
                >
                  Create an account
                </Link>
                <Link
                  href="/login/customer"
                  className="text-blue-700 underline underline-offset-4 hover:text-blue-800"
                >
                  Log in
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
