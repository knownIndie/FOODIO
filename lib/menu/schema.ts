import { z } from "zod"
import {
  menuItemAvailabilities,
  menuItemCuisines,
  menuItemFoodTypes,
} from "./constants"

export const MAX_MENU_ITEMS_PER_BATCH = 50
const MAX_DATABASE_INTEGER = 2_147_483_647

export const menuItemSchema = z.strictObject({
  name: z.string().trim().min(1, "Item name is required").max(120),
  description: z.string().trim().max(2000),
  priceInRupees: z
    .number()
    .min(0.01, "Price must be at least ₹0.01")
    .max(MAX_DATABASE_INTEGER / 100, "Price is too large")
    .refine(
      (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
      "Price must have at most two decimal places"
    ),
  isVeg: z.boolean(),
  isAvailable: z.boolean(),
  isActive: z.boolean(),
  foodTypes: z
    .array(z.enum(menuItemFoodTypes))
    .min(1, "Choose at least one food type")
    .max(menuItemFoodTypes.length),
  cuisines: z
    .array(z.enum(menuItemCuisines))
    .min(1, "Choose a cuisine")
    .max(menuItemCuisines.length),
  timings: z
    .array(z.enum(menuItemAvailabilities))
    .min(1, "Choose at least one serving time")
    .max(menuItemAvailabilities.length)
    .refine(
      (values) => values.length === 1 || !values.includes("ALL_DAY"),
      "All day cannot be combined with another serving time"
    ),
  caloriesKcal: z.number().int().min(0).max(MAX_DATABASE_INTEGER).nullable(),
})

export const menuBatchSchema = z.strictObject({
  menuItems: z
    .array(menuItemSchema)
    .min(1, "Add at least one menu item")
    .max(MAX_MENU_ITEMS_PER_BATCH, "Save at most 50 dishes at a time"),
})

export type MenuItemInput = z.infer<typeof menuItemSchema>
export type MenuBatchInput = z.infer<typeof menuBatchSchema>

export type MenuSaveResponse =
  | { success: true; createdCount: number }
  | {
      success: false
      error: string
      issues?: string[]
    }
