"use client"

import { createContext, type ReactNode, useContext, useState } from "react"

// The header chip and the home page both read the delivery location from here.
type LocationStatus = "idle" | "locating" | "error"

type Coords = {
  latitude: number
  longitude: number
}

type NominatimAddress = {
  city?: string
  town?: string
  village?: string
  state_district?: string
  state?: string
  country?: string
}

interface locationContextValue {
  city: string
  region: string
  coords: Coords | null
  status: LocationStatus
  errorMessage: string
  locate: () => void
}

const locationContext = createContext<locationContextValue | null>(null)

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

export function LocationProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState("Bengaluru")
  const [region, setRegion] = useState("Karnataka, India")
  const [coords, setCoords] = useState<Coords | null>(null)
  const [status, setStatus] = useState<LocationStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function reverseGeocode(latitude: number, longitude: number) {
    try {
      const searchParams = new URLSearchParams({
        format: "jsonv2",
        zoom: "10",
        lat: String(latitude),
        lon: String(longitude),
      })

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${searchParams}`
      )

      if (!response.ok) {
        throw new Error("Could not look up your area.")
      }

      const data = (await response.json()) as { address?: NominatimAddress }
      const address: NominatimAddress = data.address ?? {}

      setCity(
        address.city ??
          address.town ??
          address.village ??
          address.state_district ??
          "Your location"
      )
      setRegion([address.state, address.country].filter(Boolean).join(", "))
    } catch {
      // The coordinates still work for the restaurant search, so only the labels fall back.
      setCity("Your location")
      setRegion("")
    }

    setStatus("idle")
  }

  function locate() {
    if (!navigator.geolocation) {
      setErrorMessage("Your browser does not support location access.")
      setStatus("error")
      return
    }

    setErrorMessage("")
    setStatus("locating")

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords

        setCoords({ latitude, longitude })
        void reverseGeocode(latitude, longitude)
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

  return (
    <locationContext.Provider
      value={{ city, region, coords, status, errorMessage, locate }}
    >
      {children}
    </locationContext.Provider>
  )
}

export function useLocation() {
  const location = useContext(locationContext)
  if (location === null) {
    throw new Error("useLocation must be used within a LocationProvider")
  }
  return location
}
