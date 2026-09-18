export const menuItemCuisines = [
  "NORTH_INDIAN",
  "SOUTH_INDIAN",
  "CHINESE",
  "ITALIAN",
  "MEXICAN",
  "THAI",
  "JAPANESE",
  "KOREAN",
  "FRENCH",
  "OTHER",
] as const

export const menuItemFoodTypes = [
  "BURGER",
  "PIZZA",
  "PASTA",
  "BIRYANI",
  "MOMOS",
  "SANDWICH",
  "ROLLS",
  "SALAD",
  "DESSERT",
  "DRINKS",
  "OTHER",
] as const

export const menuItemAvailabilities = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "ALL_DAY",
] as const

export type MenuItemAvailability = (typeof menuItemAvailabilities)[number]

export function formatMenuItemOption(option: string) {
  return option
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}
