import { z } from "zod"
import type { MenuItemAvailability } from "@/lib/dashboard-menu/constants"
import {
  MAX_MENU_ITEMS_PER_BATCH,
  type MenuItemInput,
  menuBatchSchema,
  menuItemSchema,
} from "@/lib/dashboard-menu/schema"

// this is the test data

// formId is a React key, never part of the API payload.
const menuItemFormSchema = menuItemSchema.extend({ formId: z.string() })
export const menuFormSchema = menuBatchSchema.extend({
  menuItems: z
    .array(menuItemFormSchema)
    .min(1, "Add at least one menu item")
    .max(MAX_MENU_ITEMS_PER_BATCH, "Save at most 50 dishes at a time"),
})

export type MenuItemFormValue = z.infer<typeof menuItemFormSchema>

export const testMenuItemDetails: MenuItemInput = {
  name: "Margherita Pizza",
  description:
    "Stone-baked pizza with tomato sauce, fresh mozzarella, and basil.",
  priceInRupees: 349,
  isVeg: true,
  isAvailable: true,
  isActive: true,
  foodTypes: ["PIZZA"],
  cuisines: ["ITALIAN"],
  timings: ["ALL_DAY"],
  caloriesKcal: 620,
}

export function emptyMenuItem(formId: string): MenuItemFormValue {
  return {
    formId,
    name: "",
    description: "",
    priceInRupees: 100,
    isVeg: true,
    isAvailable: true,
    isActive: true,
    foodTypes: [],
    cuisines: ["NORTH_INDIAN"],
    timings: ["LUNCH", "DINNER"],
    caloriesKcal: null,
  }
}

export function normalizeAvailability(
  previous: MenuItemAvailability[],
  next: MenuItemAvailability[]
) {
  return !previous.includes("ALL_DAY") && next.includes("ALL_DAY")
    ? ["ALL_DAY" as const]
    : next.filter((value) => value !== "ALL_DAY")
}
