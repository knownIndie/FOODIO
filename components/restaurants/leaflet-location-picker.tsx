"use client"

import type { Map as LeafletMap } from "leaflet"
import "leaflet/dist/leaflet.css"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import { LocateFixedIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"

export type RestaurantLocation = {
  latitude: number
  longitude: number
}

type LeafletLocationPickerProps = {
  initialLocation?: RestaurantLocation
  onConfirm?: (location: RestaurantLocation) => void
  onDraftChange?: () => void
}

const DEFAULT_LOCATION: RestaurantLocation = {
  latitude: 12.9716,
  longitude: 77.5946,
}

function imageUrl(image: string | { src: string }) {
  return typeof image === "string" ? image : image.src
}

export function LeafletLocationPicker({
  initialLocation,
  onConfirm,
  onDraftChange,
}: LeafletLocationPickerProps) {
  const mapContainerRef = useRef<HTMLElement | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const initialLocationRef = useRef(initialLocation)
  const onDraftChangeRef = useRef(onDraftChange)
  const [selectedLocation, setSelectedLocation] = useState<RestaurantLocation>(
    initialLocation ?? DEFAULT_LOCATION
  )
  const [hasSelectedLocation, setHasSelectedLocation] = useState(
    Boolean(initialLocation)
  )
  const [isMapReady, setIsMapReady] = useState(false)
  const [statusMessage, setStatusMessage] = useState(
    "Loading the location map..."
  )

  useEffect(() => {
    onDraftChangeRef.current = onDraftChange
  }, [onDraftChange])

  useEffect(() => {
    let cancelled = false
    let map: LeafletMap | undefined

    async function initializeMap() {
      const L = await import("leaflet")

      if (cancelled || !mapContainerRef.current) return

      const startingLocation = initialLocationRef.current ?? DEFAULT_LOCATION
      map = L.map(mapContainerRef.current).setView(
        [startingLocation.latitude, startingLocation.longitude],
        15
      )
      mapRef.current = map

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      const locationMarkerIcon = L.icon({
        iconAnchor: [12, 41],
        iconRetinaUrl: imageUrl(markerIcon2x),
        iconSize: [25, 41],
        iconUrl: imageUrl(markerIcon),
        shadowSize: [41, 41],
        shadowUrl: imageUrl(markerShadow),
      })
      const marker = L.marker(
        [startingLocation.latitude, startingLocation.longitude],
        { draggable: true, icon: locationMarkerIcon }
      ).addTo(map)

      function selectLocation(latitude: number, longitude: number) {
        const nextLocation = { latitude, longitude }
        marker.setLatLng([latitude, longitude])
        setSelectedLocation(nextLocation)
        setHasSelectedLocation(true)
        onDraftChangeRef.current?.()
        setStatusMessage(
          "Location selected. Fine-tune it, then confirm the location."
        )
      }

      map.on("click", (event) => {
        selectLocation(event.latlng.lat, event.latlng.lng)
      })

      marker.on("dragend", () => {
        const position = marker.getLatLng()
        selectLocation(position.lat, position.lng)
      })

      map.on("locationfound", (event) => {
        map?.setView(event.latlng, 17)
        selectLocation(event.latlng.lat, event.latlng.lng)
      })

      map.on("locationerror", () => {
        setStatusMessage(
          "Current location is unavailable or permission was denied."
        )
      })

      map.whenReady(() => {
        setIsMapReady(true)
        setStatusMessage(
          initialLocationRef.current
            ? "Existing location loaded. Fine-tune it, then confirm the location."
            : "Click the map or use your current location to choose the restaurant location."
        )
      })
    }

    initializeMap().catch((error: unknown) => {
      console.error("Leaflet location picker failed to initialize.", error)
      setStatusMessage("The map could not load. Check the tile connection.")
    })

    return () => {
      cancelled = true
      mapRef.current = null
      map?.remove()
    }
  }, [])

  function useCurrentLocation() {
    setStatusMessage("Finding your current location...")
    mapRef.current?.locate({
      enableHighAccuracy: true,
      maxZoom: 17,
      setView: true,
      timeout: 10_000,
    })
  }

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border">
        <section
          aria-label="Restaurant location map"
          className="h-[22rem] w-full sm:h-[26rem]"
          ref={mapContainerRef}
        />
        {!isMapReady && (
          <div className="absolute inset-0 grid place-items-center bg-muted text-sm text-muted-foreground">
            Loading map...
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium">Selected coordinates</p>
          <p className="font-mono text-sm text-muted-foreground">
            {selectedLocation.latitude.toFixed(6)},{" "}
            {selectedLocation.longitude.toFixed(6)}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            disabled={!isMapReady}
            onClick={useCurrentLocation}
            type="button"
            variant="outline"
          >
            <LocateFixedIcon data-icon="inline-start" />
            Use current location
          </Button>
          <Button
            disabled={!isMapReady || !hasSelectedLocation}
            onClick={() => {
              onConfirm?.(selectedLocation)
              setStatusMessage("Restaurant location confirmed.")
            }}
            type="button"
          >
            Confirm location
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground" role="status">
        {statusMessage}
      </p>
    </div>
  )
}
