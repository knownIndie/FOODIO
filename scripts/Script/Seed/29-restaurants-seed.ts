import { writeFile } from "node:fs/promises"
import { hash } from "argon2"
import { and, eq, inArray, or, sql } from "drizzle-orm"
import { drizzle } from "drizzle-orm/neon-serverless"
import { PLATFORM_ROLES } from "../../../lib/auth/schema/roles"
import * as schema from "../../../lib/db/schema/schema"
import type {
  MenuItemAvailability,
  menuItemCuisines,
  menuItemFoodTypes,
} from "../../../lib/menu/constants"
import { menuBatchSchema } from "../../../lib/menu/schema"
import { pricingTiersData } from "../../../lib/pricing/pricing-teirs"

// Shared password for all 29 test restaurant owners: FoodIO-Demo-2026!
// Preview: pnpm exec tsx scripts/Script/Seed/29-restaurants-seed.ts
// Seed Neon: pnpm exec tsx --env-file=.env scripts/Script/Seed/29-restaurants-seed.ts --write
// These are fictional businesses. Bank and compliance values are demo placeholders.
// Each menu has 10 regional dishes and 10 shared sides, drinks and desserts.
// Coordinates approximate city centres, not actual restaurant addresses.

const ownerPassword = "FoodIO-Demo-2026!"

type RestaurantSeed = {
  slug: string
  name: string
  city: string
  state: string
  latitude: number
  longitude: number
  cuisine: (typeof menuItemCuisines)[number]
  menu: {
    name: string
    priceInRupees: number
    isVeg: boolean
    foodType: (typeof menuItemFoodTypes)[number]
    timing: MenuItemAvailability
  }[]
}

// Prices below are in rupees. The database stores integer paise.
function dish(
  name: string,
  priceInRupees: number,
  isVeg: boolean,
  foodType: (typeof menuItemFoodTypes)[number] = "OTHER",
  timing: MenuItemAvailability = "ALL_DAY"
): RestaurantSeed["menu"][number] {
  return { name, priceInRupees, isVeg, foodType, timing }
}

const restaurantData: RestaurantSeed[] = [
  {
    slug: "vijayawada",
    name: "Krishna River Kitchen",
    city: "Vijayawada",
    state: "Andhra Pradesh",
    latitude: 16.5062,
    longitude: 80.648,
    cuisine: "SOUTH_INDIAN",
    menu: [
      dish("Pesarattu", 120, true),
      dish("Gongura Chicken", 280, false),
      dish("Andhra Fish Curry", 290, false),
      dish("Pulihora", 140, true),
      dish("Gutti Vankaya", 180, true),
      dish("Punugulu", 90, true),
      dish("Kodi Vepudu", 260, false),
      dish("Ulavacharu", 160, true),
      dish("Bobbatlu", 100, true),
      dish("Royyala Iguru", 320, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "itanagar",
    name: "Siang Valley Table",
    city: "Itanagar",
    state: "Arunachal Pradesh",
    latitude: 27.0844,
    longitude: 93.6053,
    cuisine: "OTHER",
    menu: [
      dish("Vegetable Thukpa", 160, true),
      dish("Chicken Thukpa", 210, false),
      dish("Vegetable Momos", 140, true, "MOMOS"),
      dish("Chicken Momos", 180, false, "MOMOS"),
      dish("Bamboo Shoot Pork", 280, false),
      dish("Khura", 110, true),
      dish("Zan with Vegetables", 160, true),
      dish("Pehak with Rice", 150, true),
      dish("Steamed River Fish", 260, false),
      dish("Bamboo Shoot Vegetables", 170, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "guwahati",
    name: "Brahmaputra Bowl",
    city: "Guwahati",
    state: "Assam",
    latitude: 26.1445,
    longitude: 91.7362,
    cuisine: "OTHER",
    menu: [
      dish("Masor Tenga", 240, false),
      dish("Aloo Pitika", 110, true),
      dish("Khar with Papaya", 140, true),
      dish("Duck with Ash Gourd", 320, false),
      dish("Xaak Bhaji", 130, true),
      dish("Bamboo Shoot Chicken", 250, false),
      dish("Til Pitha", 90, true),
      dish("Narikol Laru", 80, true),
      dish("Kumol Saul with Curd", 120, true),
      dish("Black Sesame Pork", 290, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "patna",
    name: "Magadh Lunch House",
    city: "Patna",
    state: "Bihar",
    latitude: 25.5941,
    longitude: 85.1376,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Litti Chokha", 160, true),
      dish("Sattu Paratha", 120, true),
      dish("Dal Pitha", 140, true),
      dish("Chana Ghugni", 110, true),
      dish("Bihari Chicken Curry", 250, false),
      dish("Fish Curry with Rice", 260, false),
      dish("Thekua", 80, true),
      dish("Khaja", 90, true),
      dish("Dahi Chura", 100, true),
      dish("Aloo Chokha", 90, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "raipur",
    name: "Chhattisgarh Chulha",
    city: "Raipur",
    state: "Chhattisgarh",
    latitude: 21.2514,
    longitude: 81.6296,
    cuisine: "OTHER",
    menu: [
      dish("Chila", 100, true),
      dish("Fara", 120, true),
      dish("Angakar Roti", 90, true),
      dish("Dubki Kadhi", 160, true),
      dish("Bafauri", 110, true),
      dish("Chousela", 100, true),
      dish("Muthiya", 120, true),
      dish("Bore Baasi", 100, true),
      dish("Dehrori", 90, true),
      dish("Aamat", 170, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "panaji",
    name: "Mandovi Spice House",
    city: "Panaji",
    state: "Goa",
    latitude: 15.4909,
    longitude: 73.8278,
    cuisine: "OTHER",
    menu: [
      dish("Goan Fish Curry", 280, false),
      dish("Chicken Xacuti", 270, false),
      dish("Pork Vindaloo", 300, false),
      dish("Mushroom Xacuti", 220, true),
      dish("Prawn Balchao", 340, false),
      dish("Goan Vegetable Caldin", 210, true),
      dish("Chicken Cafreal", 280, false),
      dish("Bebinca", 140, false),
      dish("Goan Poi with Bhaji", 110, true),
      dish("Rava Fried Fish", 260, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "ahmedabad",
    name: "Sabarmati Thali",
    city: "Ahmedabad",
    state: "Gujarat",
    latitude: 23.0225,
    longitude: 72.5714,
    cuisine: "OTHER",
    menu: [
      dish("Khaman", 100, true),
      dish("Khandvi", 110, true),
      dish("Undhiyu", 220, true),
      dish("Thepla with Curd", 120, true),
      dish("Gujarati Dal", 130, true),
      dish("Sev Tameta", 150, true),
      dish("Handvo", 140, true),
      dish("Dabeli", 80, true),
      dish("Patra", 110, true),
      dish("Mohanthal", 100, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "rohtak",
    name: "Haryana Hearth",
    city: "Rohtak",
    state: "Haryana",
    latitude: 28.8955,
    longitude: 76.6066,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Bajra Khichdi", 150, true),
      dish("Bajra Roti with Ghee", 90, true),
      dish("Kachri Chutney", 60, true),
      dish("Hara Cholia", 170, true),
      dish("Bathua Raita", 100, true),
      dish("Kadhi Pakora", 160, true),
      dish("Besan Masala Roti", 100, true),
      dish("Mixed Dal", 140, true),
      dish("Churma", 110, true),
      dish("Meethe Chawal", 120, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "shimla",
    name: "Pahadi Dham Kitchen",
    city: "Shimla",
    state: "Himachal Pradesh",
    latitude: 31.1048,
    longitude: 77.1734,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Madra", 190, true),
      dish("Dham Thali", 300, true),
      dish("Siddu", 150, true),
      dish("Chha Gosht", 320, false),
      dish("Babru", 120, true),
      dish("Tudkiya Bhath", 180, true),
      dish("Bhey", 170, true),
      dish("Aktori", 130, true),
      dish("Mittha", 110, true),
      dish("Sepu Vadi", 200, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "ranchi",
    name: "Palash Kitchen",
    city: "Ranchi",
    state: "Jharkhand",
    latitude: 23.3441,
    longitude: 85.3096,
    cuisine: "OTHER",
    menu: [
      dish("Dhuska", 100, true),
      dish("Rugra Curry", 200, true),
      dish("Chilka Roti", 100, true),
      dish("Jharkhand Rice Thali", 180, true),
      dish("Bamboo Shoot Curry", 170, true),
      dish("Aloo Chokha with Roti", 130, true),
      dish("Arsa", 90, true),
      dish("Thekua", 80, true),
      dish("Dal Pitha", 130, true),
      dish("Chicken Curry with Rice", 240, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "bengaluru",
    name: "Bengaluru Oota",
    city: "Bengaluru",
    state: "Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    cuisine: "SOUTH_INDIAN",
    menu: [
      dish("Bisi Bele Bath", 160, true),
      dish("Ragi Mudde with Sambar", 140, true),
      dish("Mysore Masala Dosa", 140, true),
      dish("Neer Dosa", 120, true),
      dish("Akki Roti", 130, true),
      dish("Mangalore Buns", 100, true),
      dish("Chicken Ghee Roast", 290, false),
      dish("Kori Gassi", 270, false),
      dish("Mysore Pak", 100, true),
      dish("Vegetable Puliogare", 130, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "kochi",
    name: "Malabar Coconut Kitchen",
    city: "Kochi",
    state: "Kerala",
    latitude: 9.9312,
    longitude: 76.2673,
    cuisine: "SOUTH_INDIAN",
    menu: [
      dish("Appam with Vegetable Stew", 170, true),
      dish("Puttu with Kadala Curry", 160, true),
      dish("Kerala Fish Curry", 280, false),
      dish("Malabar Chicken Biryani", 260, false, "BIRYANI"),
      dish("Avial", 170, true),
      dish("Idiyappam with Egg Curry", 180, false),
      dish("Beef Ularthiyathu", 290, false),
      dish("Pazham Pori", 90, true),
      dish("Ada Pradhaman", 120, true),
      dish("Kappa with Fish Curry", 240, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "indore",
    name: "Malwa Rasoi",
    city: "Indore",
    state: "Madhya Pradesh",
    latitude: 22.7196,
    longitude: 75.8577,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Indori Poha", 90, true),
      dish("Bhutte Ka Kees", 120, true),
      dish("Dal Bafla", 220, true),
      dish("Sabudana Khichdi", 130, true),
      dish("Garadu", 110, true),
      dish("Mawa Bati", 110, true),
      dish("Bhopali Chicken Rezala", 280, false),
      dish("Chakki Ki Shaak", 180, true),
      dish("Aloo Kachori", 90, true),
      dish("Malpua", 100, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "pune",
    name: "Sahyadri Tiffin House",
    city: "Pune",
    state: "Maharashtra",
    latitude: 18.5204,
    longitude: 73.8567,
    cuisine: "OTHER",
    menu: [
      dish("Misal Pav", 140, true),
      dish("Vada Pav", 70, true),
      dish("Puran Poli", 120, true),
      dish("Pithla Bhakri", 170, true),
      dish("Bharli Vangi", 180, true),
      dish("Kolhapuri Chicken", 270, false),
      dish("Sabudana Vada", 110, true),
      dish("Thalipeeth", 130, true),
      dish("Modak", 120, true),
      dish("Kothimbir Vadi", 110, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "imphal",
    name: "Loktak Table",
    city: "Imphal",
    state: "Manipur",
    latitude: 24.817,
    longitude: 93.9368,
    cuisine: "OTHER",
    menu: [
      dish("Eromba with Fish", 180, false),
      dish("Singju with Fermented Fish", 140, false),
      dish("Chamthong Vegetable Stew", 160, true),
      dish("Nga Thongba", 250, false),
      dish("Ooti", 150, true),
      dish("Chak Hao Kheer", 130, true),
      dish("Kanghou Vegetables", 150, true),
      dish("Paknam with Fish", 170, false),
      dish("Morok Metpa with Fish", 80, false),
      dish("Chicken with Bamboo Shoots", 250, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "shillong",
    name: "Khasi Hills Kitchen",
    city: "Shillong",
    state: "Meghalaya",
    latitude: 25.5788,
    longitude: 91.8933,
    cuisine: "OTHER",
    menu: [
      dish("Jadoh with Pork", 230, false),
      dish("Dohneiiong", 290, false),
      dish("Dohkhlieh", 240, false),
      dish("Tungrymbai", 170, true),
      dish("Pumaloi", 120, true),
      dish("Pukhlein", 100, true),
      dish("Nakham Bitchi", 190, false),
      dish("Pudoh with Pork", 180, false),
      dish("Steamed Hill Vegetables", 130, true),
      dish("Black Sesame Chicken", 250, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "aizawl",
    name: "Aizawl Bamboo Bowl",
    city: "Aizawl",
    state: "Mizoram",
    latitude: 23.7271,
    longitude: 92.7176,
    cuisine: "OTHER",
    menu: [
      dish("Vegetable Bai", 160, true),
      dish("Sawhchiar with Chicken", 210, false),
      dish("Vawksa Rep", 280, false),
      dish("Bamboo Shoot Fry", 150, true),
      dish("Misa Mach Poora", 320, false),
      dish("Bekang Curry", 160, true),
      dish("Pumpkin Leaf Stew", 140, true),
      dish("Rice with Smoked Pork", 260, false),
      dish("Chhum Han", 130, true),
      dish("Chicken with Mustard Greens", 240, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "kohima",
    name: "Kohima Smoke Kitchen",
    city: "Kohima",
    state: "Nagaland",
    latitude: 25.6751,
    longitude: 94.1086,
    cuisine: "OTHER",
    menu: [
      dish("Smoked Pork with Bamboo Shoots", 300, false),
      dish("Axone Vegetable Curry", 180, true),
      dish("Anishi with Pork", 290, false),
      dish("Galho with Vegetables", 160, true),
      dish("Naga Chicken Curry", 260, false),
      dish("Steamed Mustard Greens", 130, true),
      dish("Dry Fish Chutney", 110, false),
      dish("Sticky Rice with Pork", 250, false),
      dish("Bamboo Shoot Soup", 140, true),
      dish("Black Sesame Vegetables", 170, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "bhubaneswar",
    name: "Utkal Home Kitchen",
    city: "Bhubaneswar",
    state: "Odisha",
    latitude: 20.2961,
    longitude: 85.8245,
    cuisine: "OTHER",
    menu: [
      dish("Dalma", 160, true),
      dish("Pakhala with Sides", 190, true),
      dish("Chhena Poda", 120, true),
      dish("Dahi Bara Aloo Dum", 130, true),
      dish("Santula", 140, true),
      dish("Chingudi Jhola", 300, false),
      dish("Macha Besara", 250, false),
      dish("Chakuli Pitha", 110, true),
      dish("Kakara Pitha", 100, true),
      dish("Kanika", 150, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "amritsar",
    name: "Majha Tandoor",
    city: "Amritsar",
    state: "Punjab",
    latitude: 31.634,
    longitude: 74.8723,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Amritsari Kulcha", 150, true),
      dish("Sarson Ka Saag", 190, true),
      dish("Makki Ki Roti", 90, true),
      dish("Chole Bhature", 180, true),
      dish("Dal Makhani", 210, true),
      dish("Butter Chicken", 290, false),
      dish("Amritsari Fish", 280, false),
      dish("Paneer Tikka", 240, true),
      dish("Rajma Chawal", 170, true),
      dish("Pinni", 100, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "jaipur",
    name: "Pink City Rasoi",
    city: "Jaipur",
    state: "Rajasthan",
    latitude: 26.9124,
    longitude: 75.7873,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Dal Baati Churma", 240, true),
      dish("Gatte Ki Sabzi", 180, true),
      dish("Ker Sangri", 200, true),
      dish("Laal Maas", 340, false),
      dish("Pyaaz Kachori", 100, true),
      dish("Mirchi Vada", 90, true),
      dish("Papad Ki Sabzi", 150, true),
      dish("Bajra Roti", 80, true),
      dish("Ghevar", 140, true),
      dish("Mohan Maas", 330, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "gangtok",
    name: "Teesta Dumpling House",
    city: "Gangtok",
    state: "Sikkim",
    latitude: 27.3389,
    longitude: 88.6065,
    cuisine: "OTHER",
    menu: [
      dish("Vegetable Momos", 150, true, "MOMOS"),
      dish("Chicken Momos", 190, false, "MOMOS"),
      dish("Vegetable Thukpa", 170, true),
      dish("Phagshapa", 280, false),
      dish("Gundruk Soup", 140, true),
      dish("Kinema Curry", 180, true),
      dish("Chhurpi Soup", 160, true),
      dish("Sha Phaley", 190, false),
      dish("Sel Roti", 100, true),
      dish("Chicken Thenthuk", 220, false),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "chennai",
    name: "Marina Tiffin Room",
    city: "Chennai",
    state: "Tamil Nadu",
    latitude: 13.0827,
    longitude: 80.2707,
    cuisine: "SOUTH_INDIAN",
    menu: [
      dish("Idli with Sambar", 90, true),
      dish("Ghee Pongal", 130, true),
      dish("Masala Dosa", 140, true),
      dish("Kothu Parotta with Egg", 180, false),
      dish("Chettinad Chicken", 270, false),
      dish("Vegetable Kurma", 170, true),
      dish("Medu Vada", 90, true),
      dish("Tamarind Rice", 120, true),
      dish("Kuzhi Paniyaram", 110, true),
      dish("Sakkarai Pongal", 110, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "hyderabad",
    name: "Deccan Dum Kitchen",
    city: "Hyderabad",
    state: "Telangana",
    latitude: 17.385,
    longitude: 78.4867,
    cuisine: "SOUTH_INDIAN",
    menu: [
      dish("Hyderabadi Chicken Biryani", 260, false, "BIRYANI"),
      dish("Mutton Biryani", 330, false, "BIRYANI"),
      dish("Bagara Baingan", 180, true),
      dish("Mirchi Ka Salan", 160, true),
      dish("Sarva Pindi", 120, true),
      dish("Sakinalu", 90, true),
      dish("Haleem with Mutton", 290, false),
      dish("Double Ka Meetha", 120, true),
      dish("Qubani Ka Meetha", 130, true),
      dish("Jonna Roti with Dal", 150, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "agartala",
    name: "Gomati Kitchen",
    city: "Agartala",
    state: "Tripura",
    latitude: 23.8315,
    longitude: 91.2868,
    cuisine: "OTHER",
    menu: [
      dish("Chakhwi with Pork", 240, false),
      dish("Mui Borok Vegetable Plate", 180, true),
      dish("Mosdeng Serma with Fish", 100, false),
      dish("Gudok with Fish", 220, false),
      dish("Wahan Mosdeng", 260, false),
      dish("Bamboo Shoot Curry", 160, true),
      dish("Berma Vegetable Stew", 180, false),
      dish("Steamed Fish in Banana Leaf", 250, false),
      dish("Pumpkin Curry", 140, true),
      dish("Rice Flour Pitha", 100, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "lucknow",
    name: "Gomti Nawabi Kitchen",
    city: "Lucknow",
    state: "Uttar Pradesh",
    latitude: 26.8467,
    longitude: 80.9462,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Galouti Kebab", 290, false),
      dish("Awadhi Chicken Biryani", 260, false, "BIRYANI"),
      dish("Bedmi Puri", 130, true),
      dish("Aloo Sabzi with Kachori", 120, true),
      dish("Basket Chaat", 150, true),
      dish("Nihari with Kulcha", 320, false),
      dish("Tehri", 160, true),
      dish("Matar Chaat", 110, true),
      dish("Shahi Tukda", 130, true),
      dish("Malai Makhan", 140, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "dehradun",
    name: "Garhwal Mountain Kitchen",
    city: "Dehradun",
    state: "Uttarakhand",
    latitude: 30.3165,
    longitude: 78.0322,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Kafuli", 180, true),
      dish("Chainsoo", 170, true),
      dish("Aloo Ke Gutke", 130, true),
      dish("Phaanu", 180, true),
      dish("Jhangora Kheer", 120, true),
      dish("Mandua Roti", 90, true),
      dish("Bhat Ki Churkani", 170, true),
      dish("Dubuk", 160, true),
      dish("Bal Mithai", 110, true),
      dish("Gahat Dal", 150, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "kolkata",
    name: "Hooghly Lunch Room",
    city: "Kolkata",
    state: "West Bengal",
    latitude: 22.5726,
    longitude: 88.3639,
    cuisine: "OTHER",
    menu: [
      dish("Shorshe Ilish", 390, false),
      dish("Kosha Mangsho", 330, false),
      dish("Shukto", 180, true),
      dish("Aloo Posto", 170, true),
      dish("Luchi with Cholar Dal", 150, true),
      dish("Chingri Malai Curry", 340, false),
      dish("Vegetable Chop", 100, true),
      dish("Macher Jhol", 240, false),
      dish("Mishti Doi", 100, true),
      dish("Sandesh", 110, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
  {
    slug: "delhi",
    name: "Dilli Gali Kitchen",
    city: "New Delhi",
    state: "Delhi",
    latitude: 28.6139,
    longitude: 77.209,
    cuisine: "NORTH_INDIAN",
    menu: [
      dish("Chole Kulche", 130, true),
      dish("Aloo Tikki Chaat", 120, true),
      dish("Rajma Chawal", 160, true),
      dish("Butter Chicken", 290, false),
      dish("Paneer Butter Masala", 230, true),
      dish("Chicken Seekh Kebab", 250, false),
      dish("Stuffed Aloo Paratha", 120, true),
      dish("Dahi Bhalla", 120, true),
      dish("Daulat Ki Chaat", 150, true),
      dish("Chole Bhature", 180, true),
      dish("Steamed Rice", 80, true),
      dish("Jeera Rice", 110, true, "OTHER", "LUNCH"),
      dish("Plain Curd", 60, true),
      dish("Cucumber Raita", 80, true),
      dish("Seasonal Salad", 90, true, "SALAD"),
      dish("Fresh Lime Water", 60, true, "DRINKS"),
      dish("Masala Chai", 40, true, "DRINKS"),
      dish("Sweet Lassi", 90, true, "DRINKS"),
      dish("Rice Kheer", 100, true, "DESSERT"),
      dish("Seasonal Fruit Bowl", 110, true, "DESSERT"),
    ],
  },
]

const seeds = restaurantData.map((restaurant, index) => {
  const suffix = String(index + 1).padStart(12, "0")
  const email = `seed.${restaurant.slug}@example.test`
  const username = `seed_${restaurant.slug}_owner`
  const address = `Demo address ${index + 1}, ${restaurant.city}, ${restaurant.state}, India`
  const menu = menuBatchSchema.parse({
    menuItems: restaurant.menu.map((item) => ({
      name: item.name,
      description: `${item.name}, prepared by ${restaurant.name}.`,
      priceInRupees: item.priceInRupees,
      isVeg: item.isVeg,
      foodTypes: [item.foodType],
      cuisines: [restaurant.cuisine],
      timings: [item.timing],
      isActive: true,
      isAvailable: true,
      caloriesKcal: null,
    })),
  }).menuItems
  if (
    menu.length !== 20 ||
    new Set(menu.map((item) => item.name)).size !== 20
  ) {
    throw new Error(`${restaurant.slug} must have 20 distinct dishes.`)
  }
  return {
    ...restaurant,
    id: `f00d1029-0000-4000-8000-${suffix}`,
    email,
    username,
    ownerName: `${restaurant.city} Demo Owner`,
    address,
    phone: `000${String(index + 1).padStart(7, "0")}`,
    menu,
  }
})

if (
  seeds.length !== 29 ||
  new Set(seeds.map((seed) => seed.slug)).size !== 29
) {
  throw new Error("Expected 29 distinct restaurants.")
}

async function preview() {
  const lines = [
    "# FoodIO restaurant seed preview",
    "",
    "29 fictional restaurants, 29 verified owners, 29 free subscriptions and 580 dishes.",
    "",
    "Shared owner password: `FoodIO-Demo-2026!`",
    "",
    "Each menu has 10 regional dishes plus 10 shared sides, drinks and desserts. Prices are demo prices. Vegetarian labels describe these seed recipes; dishes containing egg, meat or fish are non-vegetarian.",
    "",
    "Locations use approximate city coordinates. Contact, bank and compliance details are fictional. No OTP messages are sent. These records do not enable payments or payouts.",
    "",
    "Owners receive CUSTOMER and RESTAURANT_OWNER roles, an OWNER membership and a free subscription. The script copies the free tier limits from the database. The configured defaults are 3 restaurants and 15 staff.",
    "",
    "Restaurants are ACTIVE. Business, compliance, bank, basic and menu setup sections are COMPLETED. Each has a sole proprietorship business record, demo FSSAI and GST references, and a demo bank account.",
    "",
    "Run a preview without a database connection:",
    "",
    "```sh",
    "pnpm exec tsx scripts/Script/Seed/29-restaurants-seed.ts",
    "```",
    "",
    "Write to the database configured by DATABASE_URL:",
    "",
    "```sh",
    "pnpm exec tsx --env-file=.env scripts/Script/Seed/29-restaurants-seed.ts --write",
    "```",
    "",
    "Reruns update these seed records and preserve menu IDs. Unexpected account or restaurant collisions stop the transaction. Existing shared roles and pricing tiers are preserved.",
  ]
  for (const seed of seeds) {
    lines.push(
      "",
      `## ${seed.name}`,
      "",
      `${seed.city}, ${seed.state}. Coordinates: ${seed.latitude}, ${seed.longitude}.`,
      "",
      `Owner: ${seed.ownerName}. Username: \`${seed.username}\`. Email: \`${seed.email}\`.`,
      "",
      `Restaurant ID: \`${seed.id}\`. Address: ${seed.address}. Phone: ${seed.phone}.`,
      "",
      "| Dish | Price | Vegetarian | Food type | Serving time |",
      "| --- | ---: | --- | --- | --- |",
      ...seed.menu.map(
        (item) =>
          `| ${item.name} | ₹${item.priceInRupees} | ${item.isVeg ? "Yes" : "No"} | ${item.foodTypes[0]} | ${item.timings.join(", ")} |`
      )
    )
  }
  await writeFile(
    new URL("./preview.md", import.meta.url),
    `${lines.join("\n")}\n`
  )
  console.log(
    "Preview saved to scripts/Script/Seed/preview.md: 29 owners, 29 restaurants, 580 dishes. No database connection made."
  )
}

async function seedDatabase() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error("DATABASE_URL not set")
  // Salt each hash separately even though all owners share the same password.
  const passwordHashes = await Promise.all(seeds.map(() => hash(ownerPassword)))
  const db = drizzle(databaseUrl)
  try {
    await db.transaction(async (tx) => {
      // Prevent two copies of this script from inserting the same menus at once.
      await tx.execute(sql`SELECT pg_advisory_xact_lock(29102026)`)
      await tx
        .insert(schema.roles)
        .values(PLATFORM_ROLES.map((role) => ({ role })))
        .onConflictDoNothing()
      await tx
        .insert(schema.pricingTiers)
        .values([...pricingTiersData])
        .onConflictDoNothing()
      const [tier] = await tx
        .select()
        .from(schema.pricingTiers)
        .where(eq(schema.pricingTiers.id, 1))
      if (!tier || tier.restaurantLimit < 1)
        throw new Error("Free tier must allow at least one restaurant.")
      const ownerRoles = await tx
        .select()
        .from(schema.roles)
        .where(inArray(schema.roles.role, ["CUSTOMER", "RESTAURANT_OWNER"]))
      if (ownerRoles.length !== 2)
        throw new Error("Required owner roles are missing.")

      for (const [index, seed] of seeds.entries()) {
        const matches = await tx
          .select()
          .from(schema.profiles)
          .where(
            or(
              eq(schema.profiles.email, seed.email),
              eq(schema.profiles.username, seed.username)
            )
          )
        if (
          matches.length > 1 ||
          matches.some(
            (profile) =>
              profile.email !== seed.email ||
              profile.username !== seed.username ||
              profile.name !== seed.ownerName
          )
        ) {
          throw new Error(
            `Account collision for ${seed.slug}; no records committed.`
          )
        }
        const [existingRestaurant] = await tx
          .select()
          .from(schema.restaurants)
          .where(eq(schema.restaurants.id, seed.id))
        if (
          existingRestaurant &&
          (existingRestaurant.email !== seed.email ||
            existingRestaurant.name !== seed.name)
        ) {
          throw new Error(
            `Restaurant collision for ${seed.slug}; no records committed.`
          )
        }
        const profileValues = {
          name: seed.ownerName,
          username: seed.username,
          email: seed.email,
          password: passwordHashes[index],
          emailVerifiedAt: new Date(),
        }
        const [profile] = await tx
          .insert(schema.profiles)
          .values(profileValues)
          .onConflictDoUpdate({
            target: schema.profiles.email,
            set: profileValues,
          })
          .returning({ id: schema.profiles.id })
        await tx
          .insert(schema.profileRoles)
          .values(
            ownerRoles.map((role) => ({
              profileId: profile.id,
              roleId: role.id,
            }))
          )
          .onConflictDoNothing()
        const subscription = {
          pricingTierId: tier.id,
          restaurantLimit: tier.restaurantLimit,
          staffLimit: tier.staffLimit,
        }
        await tx
          .insert(schema.profileSubscriptions)
          .values({ profileId: profile.id, ...subscription })
          .onConflictDoUpdate({
            target: schema.profileSubscriptions.profileId,
            set: { ...subscription, updatedAt: new Date() },
          })
        const restaurantValues = {
          name: seed.name,
          phone: seed.phone,
          email: seed.email,
          address: seed.address,
          resmaplatitude: seed.latitude,
          resmaplongitude: seed.longitude,
          cuisineTypes: seed.cuisine,
          description: `Fictional demo restaurant serving regional dishes in ${seed.city}, ${seed.state}.`,
          status: "ACTIVE" as const,
        }
        await tx
          .insert(schema.restaurants)
          .values({ id: seed.id, ...restaurantValues })
          .onConflictDoUpdate({
            target: schema.restaurants.id,
            set: { ...restaurantValues, updatedAt: new Date() },
          })
        const memberships = await tx
          .select()
          .from(schema.restaurantMembers)
          .where(eq(schema.restaurantMembers.restaurantId, seed.id))
        if (
          memberships.some(
            (member) =>
              member.profileId !== profile.id && member.role === "OWNER"
          )
        ) {
          throw new Error(
            `Unexpected owner for ${seed.slug}; no records committed.`
          )
        }
        await tx
          .insert(schema.restaurantMembers)
          .values({
            profileId: profile.id,
            restaurantId: seed.id,
            role: "OWNER",
          })
          .onConflictDoUpdate({
            target: [
              schema.restaurantMembers.restaurantId,
              schema.restaurantMembers.profileId,
            ],
            set: { role: "OWNER" },
          })
        const business = {
          legal_name: `${seed.name} Demo`,
          entity_type: "sole_proprietorship",
          registered_address: seed.address,
          owner_or_poc_name: seed.ownerName,
          owner_or_poc_phone: seed.phone,
        }
        await tx
          .insert(schema.restaurantBusinessDetails)
          .values({ restaurantId: seed.id, ...business })
          .onConflictDoUpdate({
            target: schema.restaurantBusinessDetails.restaurantId,
            set: { ...business, updatedAt: new Date() },
          })
        for (const type of ["FSSAI", "GST"] as const) {
          const registration_number = `DEMO-${type}-${seed.slug.toUpperCase()}`
          await tx
            .insert(schema.restaurantCompliances)
            .values({ restaurantId: seed.id, type, registration_number })
            .onConflictDoUpdate({
              target: [
                schema.restaurantCompliances.restaurantId,
                schema.restaurantCompliances.type,
              ],
              set: { registration_number, updatedAt: new Date() },
            })
        }
        const bank = {
          accountNumber: `DEMO-${seed.slug}`,
          bankName: "FoodIO Demo Bank",
          ifsc: "DEMO0000000",
        }
        await tx
          .insert(schema.restaurantBankAccounts)
          .values({ restaurantId: seed.id, ...bank })
          .onConflictDoUpdate({
            target: schema.restaurantBankAccounts.restaurantId,
            set: { ...bank, updatedAt: new Date() },
          })
        const existingItems = await tx
          .select({ id: schema.menuItems.id, name: schema.menuItems.name })
          .from(schema.menuItems)
          .where(eq(schema.menuItems.restaurantId, seed.id))
        if (
          new Set(existingItems.map((item) => item.name)).size !==
            existingItems.length ||
          existingItems.some(
            (item) => !seed.menu.some((dish) => dish.name === item.name)
          )
        ) {
          throw new Error(
            `Unexpected menu for ${seed.slug}; no records committed.`
          )
        }
        const newItems: (typeof schema.menuItems.$inferInsert)[] = []
        for (const item of seed.menu) {
          const { priceInRupees, ...details } = item
          const values = {
            ...details,
            restaurantId: seed.id,
            priceInPaise: Math.round(priceInRupees * 100),
          }
          const existing = existingItems.find(
            (saved) => saved.name === item.name
          )
          if (existing) {
            await tx
              .update(schema.menuItems)
              .set({ ...values, updatedAt: new Date() })
              .where(
                and(
                  eq(schema.menuItems.id, existing.id),
                  eq(schema.menuItems.restaurantId, seed.id)
                )
              )
          } else {
            newItems.push(values)
          }
        }
        if (newItems.length) await tx.insert(schema.menuItems).values(newItems)
        const setup = {
          restaurantBasicStatus: "COMPLETED",
          restaurantBusinessDetailsStatus: "COMPLETED",
          restaurantCompliancesStatus: "COMPLETED",
          restaurantBankAccountsStatus: "COMPLETED",
          menuItemsStatus: "COMPLETED",
        } as const
        await tx
          .insert(schema.restaurantSetupStatus)
          .values({ restaurantId: seed.id, ...setup })
          .onConflictDoUpdate({
            target: schema.restaurantSetupStatus.restaurantId,
            set: setup,
          })
      }
      const savedItems = await tx
        .select({ id: schema.menuItems.id })
        .from(schema.menuItems)
        .where(
          inArray(
            schema.menuItems.restaurantId,
            seeds.map((seed) => seed.id)
          )
        )
      if (savedItems.length !== 580)
        throw new Error(`Expected 580 dishes, found ${savedItems.length}.`)
    })
  } finally {
    await db.$client.end()
  }
  console.log(
    "Seed committed: 29 verified owners, 29 free subscriptions, 29 restaurants and 580 dishes."
  )
}

if (process.argv.slice(2).some((argument) => argument !== "--write")) {
  throw new Error("Supported argument: --write. Omit it to generate a preview.")
}
if (process.argv.includes("--write")) {
  await seedDatabase()
} else {
  await preview()
}
