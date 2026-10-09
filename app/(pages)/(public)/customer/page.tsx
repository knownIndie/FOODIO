import { NearbyRestaurants } from "@/components/customer-homepage/nearby-restaurants"
import { nearlocationData } from "@/lib/home-data/queries"

const DEFAULT_CITY = {
  // label: "Delhi",
  // latitude: 28.6139,
  // longitude: 77.209,
  label: "Bengaluru",
  latitude: 12.9716,
  longitude: 77.5946,
}

export default async function CustomerPage() {
  const initialRestaurants = await nearlocationData({
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
    readiusFromLocation: 100,
  })

  return (
    <>
      <section className="max-w-3xl space-y-3">
        <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
          Food delivery restaurants
        </h1>

        <p className="text-lg text-muted-foreground">
          Browse restaurants in {DEFAULT_CITY.label} or use your current
          location to find restaurants near you.
        </p>
      </section>

      <NearbyRestaurants
        initialLocationLabel={DEFAULT_CITY.label}
        initialRestaurants={initialRestaurants}
      />
    </>
  )
}
