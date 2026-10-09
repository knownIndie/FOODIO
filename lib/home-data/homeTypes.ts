export type nearbyMenuItem = {
  id: number
  name: string
  description: string | null
  priceInPaise: number
  isVeg: boolean
  foodTypes: string[]
  cuisines: string[]
  caloriesKcal: number | null
}

export type nearbyRestaurant = {
  id: string
  name: string
  distanceKm: number
  items: nearbyMenuItem[]
}

export type nearbyRestaurantsResponse = {
  restaurants: nearbyRestaurant[]
}
