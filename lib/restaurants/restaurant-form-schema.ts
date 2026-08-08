import * as z from "zod"

const coordinateSchema = (label: string, minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => Number.isFinite(Number(value)), {
      message: `${label} must be a number.`,
    })
    .refine(
      (value) => {
        const coordinate = Number(value)
        return coordinate >= minimum && coordinate <= maximum
      },
      {
        message: `${label} must be between ${minimum} and ${maximum}.`,
      }
    )

export const restaurantFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Restaurant name must be at least 2 characters.")
    .max(120, "Restaurant name must be at most 120 characters."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid restaurant phone number.")
    .max(20, "Phone number must be at most 20 characters.")
    .regex(/^\+?[0-9][0-9\s-]+$/, "Enter a valid restaurant phone number."),
  email: z
    .string()
    .trim()
    .email("Enter a valid restaurant email address.")
    .or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(5, "Enter the complete restaurant address.")
    .max(500, "Address must be at most 500 characters."),
  latitude: coordinateSchema("Latitude", -90, 90),
  longitude: coordinateSchema("Longitude", -180, 180),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be at most 1000 characters."),
})
