import * as z from "zod"

export const restaurantFirstSetupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters.")
    .max(120, "Restaurant name must be at most 120 characters."),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters."),
})
