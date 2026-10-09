import "server-only"
import { and, asc, eq, inArray, isNotNull, lte, sql } from "drizzle-orm"
import { db } from "../db/drizzle"
import { menuItems, restaurants } from "../db/schema/schema"

export type SearchQueryData = {
  latitude: number
  longitude: number
  readiusFromLocation?: number
}
export type NearbyMenuItem = {
  id: number
  name: string
  description: string | null
  priceInPaise: number
  isVeg: boolean
  foodTypes: string[]
  cuisines: string[]
  caloriesKcal: number | null
}

export async function nearlocationData({
  latitude,
  longitude,
  readiusFromLocation = 20,
}: SearchQueryData) {
  /*
 this formula help with finding the distance between two points on a sphere i.e earth
expression uses the spherical law of cosines.
 6371 is the approximate radius of Earth in kilometres.
  */
  const distanceKM = sql<number>`
    6371 * acos(
      least(
        1.0,
        greatest(
          -1.0,
          cos(radians(${latitude})) *
          cos(radians(${restaurants.resmaplatitude})) *
          cos(
            radians(${restaurants.resmaplongitude}) -
            radians(${longitude})
          ) +
          sin(radians(${latitude})) *
          sin(radians(${restaurants.resmaplatitude}))
        )
      )
    )
  `
  /*
this is the first call that were making to the database. The main function of this call is to get restaurants that are within a given radius and we also extract the ID is using a map which returns as an array.
*/
  const nearbyRestaurants = await db
    .select({ id: restaurants.id, name: restaurants.name, distanceKM })
    .from(restaurants)
    .where(
      and(
        eq(restaurants.status, "ACTIVE"),
        isNotNull(restaurants.resmaplongitude),
        isNotNull(restaurants.resmaplatitude),
        lte(distanceKM, readiusFromLocation)
      )
    )
    .orderBy(asc(distanceKM))
  // .limit( ) add if needed later on boi
  if (nearbyRestaurants.length === 0) {
    return []
  }

  const nearbyRestaurantsIds = nearbyRestaurants.map(
    (restaurant) => restaurant.id
  )

  /*
 Now this is the second date of his Call here given the Restaurant ideas what we can do is we're going to call the Restaurant menu for the given ID
  */

  const availableMenuItems = await db
    .select({
      restaurantId: menuItems.restaurantId,
      id: menuItems.id,
      name: menuItems.name,
      description: menuItems.description,
      priceInPaise: menuItems.priceInPaise,
      isVeg: menuItems.isVeg,
      foodTypes: menuItems.foodTypes,
      cuisines: menuItems.cuisines,
      caloriesKcal: menuItems.caloriesKcal,
    })
    .from(menuItems)
    .where(
      and(
        inArray(menuItems.restaurantId, nearbyRestaurantsIds),
        // inArray -> is is used to find all the values that are present inside the array you provide given a particular field in a particular database
        eq(menuItems.isActive, true),
        eq(menuItems.isAvailable, true)
      )
    )
    .orderBy(asc(menuItems.id))

  /*
  Now from the second function function, what we have done as we are able to get the menu data also but this data again is in the form of an array now what we need to do is going to take this convert this into a form where we have the restaurant and the menu items into like a map that we can have same restaurant multiple times and different menu for each of them and then we need to convert that into a flat map where one restaurant name is essentially containing an  array of multiple objects having multiple different menu items
  */

  const menuItemsByRestaurants = new Map<string, NearbyMenuItem[]>()

  for (const item of availableMenuItems) {
    const { restaurantId, ...menuItem } = item

    // Get this restaurant's existing array, or create an empty one.
    const resItem = menuItemsByRestaurants.get(restaurantId) ?? []

    // Add this menu item to that array.
    resItem.push(menuItem)

    // Store the array under this restaurant's ID.
    menuItemsByRestaurants.set(restaurantId, resItem)
  }

  //  now we create a flat map for the menuItemsByrestaurants by making them have restaurant name ans then it has object with all the menu items for that restaurant

  return nearbyRestaurants.flatMap((restaurant) => {
    const items = menuItemsByRestaurants.get(restaurant.id) ?? []
    if (items.length === 0) return []
    return [
      {
        id: restaurant.id,
        name: restaurant.name,
        distanceKm: Math.round(restaurant.distanceKM * 10) / 10,
        items,
      },
    ]
  })
}
