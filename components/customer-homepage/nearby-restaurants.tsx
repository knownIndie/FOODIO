"use client"

import { LoaderCircleIcon, LocateFixedIcon } from "lucide-react"
import { useState } from "react"
import { MenuItemCard } from "@/components/menu/components/menu-item-card"
import { Button } from "@/components/ui/button"
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

export function NearbyRestaurants({
  initialLocationLabel,
  initialRestaurants,
}: NearbyRestaurantsProps) {
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Restaurants near {locationLabel}
          </h2>

          {status === "locating" && (
            <p className="text-sm text-muted-foreground" role="status">
              Asking your browser for your location...
            </p>
          )}

          {status === "loading" && (
            <p className="text-sm text-muted-foreground" role="status">
              Updating the restaurant list...
            </p>
          )}
        </div>

        <Button
          disabled={isBusy}
          onClick={useCurrentLocation}
          type="button"
          variant="outline"
        >
          {isBusy ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <LocateFixedIcon />
          )}

          {buttonLabel}
        </Button>
      </div>

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
              No active restaurants with available dishes were found near this
              location.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-10">
          {restaurants.map((restaurant) => (
            <section className="space-y-4" key={restaurant.id}>
              <div>
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>

                <p className="text-sm text-muted-foreground">
                  About {restaurant.distanceKm} km from {locationLabel}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {restaurant.items.map((item) => (
                  <MenuItemCard
                    item={item}
                    key={item.id}
                    restaurant={restaurant}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
