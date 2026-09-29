import { signupFormSchema } from "../../../lib/auth/schema/form-schemas"
import { menuBatchSchema } from "../../../lib/dashboard-menu/schema"
import { regionalTemplates } from "./restaurant-menu-templates"

export const ownerPassword = "FoodIO-Demo-2026!"

// A test coverage selection, not a population ranking. Coordinates are approximate.
export const cities = [
  ["Mumbai", "Maharashtra", 19.076, 72.8777, "pune"],
  ["New Delhi", "Delhi", 28.6139, 77.209, "delhi"],
  ["Bengaluru", "Karnataka", 12.9716, 77.5946, "bengaluru"],
  ["Hyderabad", "Telangana", 17.385, 78.4867, "hyderabad"],
  ["Chennai", "Tamil Nadu", 13.0827, 80.2707, "chennai"],
  ["Kolkata", "West Bengal", 22.5726, 88.3639, "kolkata"],
  ["Pune", "Maharashtra", 18.5204, 73.8567, "pune"],
  ["Ahmedabad", "Gujarat", 23.0225, 72.5714, "ahmedabad"],
  ["Jaipur", "Rajasthan", 26.9124, 75.7873, "jaipur"],
  ["Surat", "Gujarat", 21.1702, 72.8311, "ahmedabad"],
  ["Lucknow", "Uttar Pradesh", 26.8467, 80.9462, "lucknow"],
  ["Kanpur", "Uttar Pradesh", 26.4499, 80.3319, "lucknow"],
  ["Nagpur", "Maharashtra", 21.1458, 79.0882, "pune"],
  ["Indore", "Madhya Pradesh", 22.7196, 75.8577, "indore"],
  ["Bhopal", "Madhya Pradesh", 23.2599, 77.4126, "indore"],
  ["Patna", "Bihar", 25.5941, 85.1376, "patna"],
  ["Chandigarh", "Chandigarh", 30.7333, 76.7794, "amritsar"],
  ["Gurugram", "Haryana", 28.4595, 77.0266, "delhi"],
  ["Noida", "Uttar Pradesh", 28.5355, 77.391, "delhi"],
  ["Kochi", "Kerala", 9.9312, 76.2673, "kochi"],
  ["Thiruvananthapuram", "Kerala", 8.5241, 76.9366, "kochi"],
  ["Coimbatore", "Tamil Nadu", 11.0168, 76.9558, "chennai"],
  ["Visakhapatnam", "Andhra Pradesh", 17.6868, 83.2185, "vijayawada"],
  ["Vijayawada", "Andhra Pradesh", 16.5062, 80.648, "vijayawada"],
  ["Bhubaneswar", "Odisha", 20.2961, 85.8245, "bhubaneswar"],
  ["Guwahati", "Assam", 26.1445, 91.7362, "guwahati"],
  ["Ranchi", "Jharkhand", 23.3441, 85.3096, "ranchi"],
  ["Raipur", "Chhattisgarh", 21.2514, 81.6296, "raipur"],
  ["Dehradun", "Uttarakhand", 30.3165, 78.0322, "dehradun"],
] as const

export const prefixes = [
  "Saffron",
  "Copper",
  "Golden",
  "Monsoon",
  "Mango",
  "Tamarind",
  "Banyan",
  "Coconut",
  "Pepper",
  "Cinnamon",
  "Cardamom",
  "Jasmine",
  "Marigold",
  "Curry",
  "Mint",
  "Ginger",
  "Chilli",
  "Sesame",
  "Clove",
  "Lemon",
] as const
export const suffixes = [
  "Kitchen",
  "Table",
  "Bowl",
  "Rasoi",
  "Tiffin House",
  "Canteen",
  "Courtyard",
  "Dining Room",
  "Spice House",
  "Lunch Room",
  "Eatery",
  "Cafe",
  "Bistro",
  "Food Corner",
  "Supper Club",
  "Cookhouse",
  "Pantry",
  "Terrace",
  "Diner",
  "Thali House",
] as const

const extras = [
  ["Dal Tadka", 150, true, "OTHER", "NORTH_INDIAN"],
  ["Paneer Tikka", 240, true, "OTHER", "NORTH_INDIAN"],
  ["Vegetable Hakka Noodles", 190, true, "OTHER", "CHINESE"],
  ["Chicken Fried Rice", 220, false, "OTHER", "CHINESE"],
  ["Tomato Soup", 110, true, "OTHER", "OTHER"],
  ["Grilled Vegetable Sandwich", 160, true, "SANDWICH", "OTHER"],
  ["Masala Fries", 120, true, "OTHER", "OTHER"],
  ["Cold Coffee", 130, true, "DRINKS", "OTHER"],
  ["Chocolate Brownie", 140, true, "DESSERT", "OTHER"],
  ["Vanilla Ice Cream", 90, true, "DESSERT", "OTHER"],
  ["Mango Milkshake", 140, true, "DRINKS", "OTHER"],
  ["Vegetable Spring Rolls", 170, true, "ROLLS", "CHINESE"],
] as const

export const seeds = Array.from({ length: 1000 }, (_, index) => {
  const cityIndex = index % cities.length
  const localIndex = Math.floor(index / cities.length)
  const [city, state, latitude, longitude, regionalSlug] = cities[cityIndex]
  // Alternate local and other regional menus within each city.
  const template =
    localIndex % 3 === 0
      ? regionalTemplates[(localIndex + cityIndex) % regionalTemplates.length]
      : regionalTemplates.find((entry) => entry.slug === regionalSlug)
  if (!template) throw new Error(`Missing menu template for ${city}`)
  const citySlug = city.toLowerCase().replaceAll(" ", "-")
  const slug = `${citySlug}-${String(localIndex + 1).padStart(3, "0")}`
  const name = `${prefixes[(localIndex + cityIndex) % prefixes.length]} ${suffixes[(Math.floor(localIndex / prefixes.length) + cityIndex) % suffixes.length]} ${city}`
  const targetSize = 20 + (index % 11)
  const dishes = template.menu.map((item) => ({
    name: item.name,
    description: `${item.name}, prepared by ${name}.`,
    priceInRupees: item.priceInRupees + (localIndex % 5) * 10,
    isVeg: item.isVeg,
    foodTypes: [item.foodType],
    cuisines: [template.cuisine],
    timings: [item.timing],
    isActive: true,
    isAvailable: true,
    caloriesKcal: null,
  }))
  for (const [dishName, price, isVeg, foodType, cuisine] of extras) {
    if (dishes.length === targetSize) break
    if (dishes.some((item) => item.name === dishName)) continue
    dishes.push({
      name: dishName,
      description: `${dishName}, prepared by ${name}.`,
      priceInRupees: price + (localIndex % 5) * 10,
      isVeg,
      foodTypes: [foodType],
      cuisines: [cuisine],
      timings: ["ALL_DAY"],
      isActive: true,
      isAvailable: true,
      caloriesKcal: null,
    })
  }
  const menu = menuBatchSchema.parse({ menuItems: dishes }).menuItems
  if (
    menu.length !== targetSize ||
    new Set(menu.map((item) => item.name)).size !== targetSize
  ) {
    throw new Error(`Expected ${targetSize} distinct dishes for ${slug}`)
  }
  return {
    id: `f00d1000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
    slug,
    name,
    city,
    state,
    // Synthetic nearby points give each restaurant its own test location.
    latitude: Number((latitude + ((localIndex % 7) - 3) * 0.004).toFixed(6)),
    longitude: Number(
      (longitude + (Math.floor(localIndex / 7) - 2) * 0.004).toFixed(6)
    ),
    cuisine: [...new Set(menu.flatMap((item) => item.cuisines))].join(", "),
    email: `seed1000.${slug}@example.test`,
    username: `seed1000_${citySlug.replaceAll("-", "_").slice(0, 17)}_${String(localIndex + 1).padStart(3, "0")}`,
    ownerName: `${name} Demo Owner`,
    address: `Demo address ${localIndex + 1}, ${city}, ${state}, India`,
    phone: `000${String(index + 1).padStart(7, "0")}`,
    menu,
  }
})

for (const field of ["id", "slug", "name", "email", "username"] as const) {
  if (new Set(seeds.map((seed) => seed[field])).size !== 1000) {
    throw new Error(`Seed ${field} values must be unique`)
  }
}
if (new Set(seeds.map((seed) => seed.city)).size !== 29)
  throw new Error("Expected 29 cities")
export const totalDishes = seeds.reduce(
  (total, seed) => total + seed.menu.length,
  0
)

for (const seed of seeds) {
  signupFormSchema.parse({
    name: seed.ownerName,
    username: seed.username,
    email: seed.email,
    password: ownerPassword,
  })
}
