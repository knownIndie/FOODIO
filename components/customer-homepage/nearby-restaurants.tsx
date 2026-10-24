"use client"

import {
  ArrowRightIcon,
  CheckIcon,
  LoaderCircleIcon,
  LocateFixedIcon,
  MapPinIcon,
  SearchIcon,
  ShoppingBagIcon,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useCart } from "@/components/cart/cart-provider"
import { FoodMark } from "@/components/cart/components/food-mark"
import { formatPrice } from "@/components/cart/components/order-price"
import { containerWidth } from "@/components/extras/classname-extras"
import { MenuItemCard } from "@/components/menu/components/menu-item-card"
import { formatMenuItemOption } from "@/components/menu/entries/menuFormData"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type {
  nearbyRestaurant,
  nearbyRestaurantsResponse,
} from "@/lib/home-data/homeTypes"
import { cn } from "@/lib/utils"

type NearbyRestaurantsProps = {
  initialLocationLabel: string
  initialRestaurants: nearbyRestaurant[]
}

type Status = "idle" | "locating" | "loading" | "error"

function getLocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return "Location permission was denied. Allow location access in your browser and try again."
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "Your current location is unavailable."
  }

  if (error.code === error.TIMEOUT) {
    return "Finding your location took too long. Try again."
  }

  return "Could not find your current location."
}

function getCuisines(restaurant: nearbyRestaurant) {
  const cuisines = new Set(restaurant.items.flatMap((item) => item.cuisines))
  cuisines.delete("OTHER")

  return [...cuisines]
    .map((cuisine) => formatMenuItemOption(cuisine))
    .join(", ")
}

export function NearbyRestaurants({
  initialLocationLabel,
  initialRestaurants,
}: NearbyRestaurantsProps) {
  const { items: cartItems } = useCart()

  const [restaurants, setRestaurants] = useState(initialRestaurants)

  const [locationLabel, setLocationLabel] = useState(initialLocationLabel)

  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function loadNearbyRestaurants(latitude: number, longitude: number) {
    setStatus("loading")

    try {
      const searchParams = new URLSearchParams({
        lat: String(latitude),
        lng: String(longitude),
      })

      const response = await fetch(`/api/restaurants/nearby?${searchParams}`, {
        cache: "no-store",
      })

      const body: unknown = await response.json()

      if (!response.ok) {
        const errorBody = body as {
          error?: string
        }

        throw new Error(errorBody.error ?? "Could not load nearby restaurants.")
      }

      const data = body as nearbyRestaurantsResponse

      setRestaurants(data.restaurants)
      setLocationLabel("your location")
      setErrorMessage("")
      setStatus("idle")
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Could not load nearby restaurants."
      )

      /*
       * Keep showing the existing restaurants
       * when the location request fails.
       */
      setStatus("error")
    }
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      setErrorMessage("Your browser does not support location access.")
      setStatus("error")
      return
    }

    setErrorMessage("")
    setStatus("locating")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        void loadNearbyRestaurants(
          position.coords.latitude,
          position.coords.longitude
        )
      },
      (error) => {
        setErrorMessage(getLocationErrorMessage(error))
        setStatus("error")
      },
      {
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 10_000,
      }
    )
  }

  const isBusy = status === "locating" || status === "loading"

  let buttonLabel = "Use my current location"

  if (status === "locating") {
    buttonLabel = "Finding your location..."
  }

  if (status === "loading") {
    buttonLabel = "Loading restaurants..."
  }

  const dishTypes = [
    ...new Set(
      restaurants.flatMap((restaurant) =>
        restaurant.items.flatMap((item) => item.foodTypes)
      )
    ),
  ].filter((foodType) => foodType !== "OTHER")

  // The first two dishes fill the decorative photo placeholders in the hero.
  const [bigDish, smallDish] = restaurants.flatMap(
    (restaurant) => restaurant.items
  )
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  )

  return (
    <>
      <section className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden bg-brand-orange text-white">
        <div
          className={cn(
            containerWidth,
            "grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-2"
          )}
        >
          <div className="max-w-2xl space-y-6">
            <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Order food from kitchens near you. Delivered hot.
            </h1>

            <p className="max-w-md text-lg font-semibold text-white/95">
              Discover food from local kitchens in {locationLabel}, or join the
              people behind your next meal.
            </p>

            <div className="max-w-xl space-y-4">
              <div className="flex h-14 items-center gap-3 rounded-full bg-white pr-5 pl-4 text-zinc-900 shadow-lg focus-within:ring-4 focus-within:ring-white/40">
                <span className="flex shrink-0 items-center gap-1.5 border-r border-zinc-200 pr-3 text-sm font-bold">
                  <MapPinIcon
                    aria-hidden="true"
                    className="size-4 text-brand-orange"
                  />
                  {locationLabel}
                </span>

                <input
                  type="search"
                  placeholder="Search for dishes or restaurants"
                  aria-label="Search for dishes or restaurants"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500"
                />

                <SearchIcon
                  aria-hidden="true"
                  className="size-5 shrink-0 text-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={useCurrentLocation}
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-bold text-white underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:opacity-80"
                >
                  {isBusy ? (
                    <LoaderCircleIcon
                      aria-hidden="true"
                      className="size-4 animate-spin"
                    />
                  ) : (
                    <LocateFixedIcon aria-hidden="true" className="size-4" />
                  )}

                  {buttonLabel}
                </button>

                {status === "locating" && (
                  <output className="block text-sm text-white/90">
                    Asking your browser for your location...
                  </output>
                )}

                {status === "loading" && (
                  <output className="block text-sm text-white/90">
                    Updating the restaurant list...
                  </output>
                )}
              </div>
            </div>
          </div>

          <div aria-hidden="true" className="relative hidden h-80 lg:block">
            {bigDish && (
              <div className="absolute top-0 right-6 flex size-72 flex-col items-center justify-center gap-1 rounded-full border-8 border-white bg-brand-cream px-8 text-center text-brand-cream-foreground shadow-xl">
                <span className="font-heading text-xl font-bold">
                  {bigDish.name}
                </span>
                <span className="text-xs opacity-75">Dish photo</span>
              </div>
            )}

            {smallDish && (
              <div className="absolute bottom-0 left-4 flex size-40 flex-col items-center justify-center gap-1 rounded-full border-4 border-white bg-brand-cream px-4 text-center text-brand-cream-foreground shadow-xl">
                <span className="font-heading text-base font-bold">
                  {smallDish.name}
                </span>
                <span className="text-xs opacity-75">Dish photo</span>
              </div>
            )}

            {restaurants.length > 0 && (
              <div className="absolute right-0 bottom-4 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-zinc-900 shadow-lg">
                <span className="flex size-6 items-center justify-center rounded-full bg-brand-green text-white">
                  <CheckIcon className="size-3.5" />
                </span>
                <span>
                  <span className="block text-sm font-bold">
                    {restaurants.length}{" "}
                    {restaurants.length === 1 ? "kitchen" : "kitchens"} nearby
                  </span>
                  <span className="block text-xs text-zinc-500">
                    in {locationLabel}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {dishTypes.length > 0 && (
        <section aria-labelledby="dish-types-title" className="space-y-4">
          <h2 id="dish-types-title" className="font-heading text-xl font-bold">
            What&apos;s on your mind?
          </h2>

          <ul
            aria-label="Dish types"
            className="flex gap-6 overflow-x-auto pt-1 pb-2"
          >
            <li className="flex shrink-0 flex-col items-center gap-2 text-sm font-bold text-zinc-900">
              <span
                aria-hidden="true"
                className="flex size-16 items-center justify-center rounded-full bg-brand-cream font-heading text-xl font-bold text-brand-cream-foreground ring-2 ring-brand-orange ring-offset-2"
              >
                A
              </span>
              All
            </li>

            {dishTypes.map((foodType) => {
              const label = formatMenuItemOption(foodType)

              return (
                <li
                  className="flex shrink-0 flex-col items-center gap-2 text-sm font-semibold text-zinc-700"
                  key={foodType}
                >
                  <span
                    aria-hidden="true"
                    className="flex size-16 items-center justify-center rounded-full bg-brand-cream font-heading text-xl font-bold text-brand-cream-foreground"
                  >
                    {label.charAt(0)}
                  </span>
                  {label}
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0 space-y-12">
          {status === "error" && (
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle>Location was not updated</CardTitle>
                <CardDescription>
                  {errorMessage} You can continue browsing the restaurants near{" "}
                  {locationLabel}.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {restaurants.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No restaurants found near {locationLabel}</CardTitle>
                <CardDescription>
                  No active restaurants with available dishes were found near
                  this location.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            restaurants.map((restaurant) => {
              const cuisines = getCuisines(restaurant)
              const isPureVeg =
                restaurant.items.length > 0 &&
                restaurant.items.every((item) => item.isVeg)

              return (
                <section className="space-y-6" key={restaurant.id}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h2 className="font-heading text-2xl font-bold tracking-tight">
                        {restaurant.name}
                      </h2>

                      <p className="text-sm text-muted-foreground">
                        {cuisines && `${cuisines} · `}About{" "}
                        {restaurant.distanceKm} km from {locationLabel}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {isPureVeg && (
                        <span className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-white px-3 text-sm font-semibold">
                          <FoodMark veg />
                          Pure veg
                        </span>
                      )}

                      <span className="inline-flex h-8 items-center rounded-full border border-border bg-white px-3 text-sm font-semibold">
                        {restaurant.items.length}{" "}
                        {restaurant.items.length === 1 ? "dish" : "dishes"}
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
                    {restaurant.items.map((item) => (
                      <MenuItemCard
                        item={item}
                        key={item.id}
                        restaurant={restaurant}
                      />
                    ))}
                  </div>
                </section>
              )
            })
          )}
        </div>

        <aside
          aria-label="Cart summary"
          className="hidden lg:sticky lg:top-24 lg:block"
        >
          <section className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-brand-orange-soft text-brand-orange"
              >
                <ShoppingBagIcon className="size-5" />
              </span>

              <div className="min-w-0">
                <h2 className="truncate font-heading text-lg font-bold">
                  {cartItems[0]?.restaurantName ?? "Your cart"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {cartCount === 0
                    ? "No items yet"
                    : `${cartCount} ${cartCount === 1 ? "item" : "items"}`}
                </p>
              </div>
            </div>

            {cartItems.length === 0 ? (
              <p className="mt-5 border-t border-border pt-5 text-sm text-muted-foreground">
                Add dishes from a kitchen to start your order.
              </p>
            ) : (
              <>
                <ul className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                  {cartItems.map((item) => (
                    <li
                      className="flex items-start justify-between gap-3"
                      key={item.id}
                    >
                      <span className="flex min-w-0 items-start gap-2">
                        <FoodMark veg={item.veg} />
                        <span>
                          {item.name}{" "}
                          <span className="text-muted-foreground">
                            × {item.quantity}
                          </span>
                        </span>
                      </span>
                      <span className="font-semibold whitespace-nowrap">
                        {formatPrice(item.priceInPaise * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-center justify-between border-t border-border pt-5 font-bold">
                  <span>Item total</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>

                <Link
                  href="/customer/order"
                  className="mt-4 flex h-12 items-center justify-between rounded-2xl bg-brand-green px-5 font-bold text-white hover:bg-brand-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
                >
                  Checkout
                  <ArrowRightIcon aria-hidden="true" className="size-5" />
                </Link>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Final taxes &amp; delivery charges shown before payment
                </p>
              </>
            )}
          </section>
        </aside>
      </div>
    </>
  )
}
