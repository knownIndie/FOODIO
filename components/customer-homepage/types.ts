export type NearByMenuItemData = {
  id: number
  restaurantId: string
  name: string
  priceInPaise: number
  quantity: number
  foodTypes: string[]
  cuisines: string[]
  veg: boolean
  caloriesKcal?: number | null
  description?: string | null
}
export type NearbyRestaurantData = {
  id: string
  name: string
  distance: number
  menuItem: NearByMenuItemData[]
}

export type NearbyRestaurant = {
  restaurants: NearbyRestaurantData[]
}
