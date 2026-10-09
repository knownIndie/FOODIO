import type { nearbyRestaurantsResponse } from "@/lib/home-data/homeTypes"
import { nearlocationData } from "@/lib/home-data/queries"

export const dynamic = "force-dynamic"

function readCoordinate(
  // function to check if the lat and long is valid
  value: string | null,
  minimum: number,
  maximum: number
) {
  if (value === null || value.trim() === "") {
    return null
  }

  const coordinate = Number(value)

  if (
    !Number.isFinite(coordinate) ||
    coordinate < minimum ||
    coordinate > maximum
  ) {
    return null
  }

  return coordinate
}

export async function GET(request: Request) {
  const url = new URL(request.url) // parse the request url

  const latitude = readCoordinate(url.searchParams.get("lat"), -90, 90) // lat has -90 to 90

  const longitude = readCoordinate(url.searchParams.get("lng"), -180, 180) // long has -180 to 180

  if (latitude === null || longitude === null) {
    return Response.json(
      {
        error: "Valid latitude and longitude are required.",
      },
      {
        status: 400,
      }
    )
  }

  try {
    const restaurants = await nearlocationData({
      latitude,
      longitude,
      readiusFromLocation: 20,
    })

    const response: nearbyRestaurantsResponse = {
      restaurants,
    }

    return Response.json(response)
  } catch (error) {
    console.error("Could not fetch nearby restaurants.", error)

    return Response.json(
      {
        error: "Could not load nearby restaurants.",
      },
      {
        status: 500,
      }
    )
  }
}
