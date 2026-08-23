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
      { message: `${label} must be between ${minimum} and ${maximum}.` }
    )

export const restaurantIdSchema = z.uuid("Invalid restaurant ID.")

export const createRestaurantSchema = z.object({
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

export const restaurantBasicSchema = z.object({
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
})

export const restaurantBusinessSchema = z.object({
  legalName: z
    .string()
    .trim()
    .min(2, "Enter the registered legal name.")
    .max(160, "Legal name must be at most 160 characters."),
  entityType: z.enum([
    "sole_proprietorship",
    "partnership",
    "llp",
    "private_limited",
    "public_limited",
    "other",
  ]),
  registeredAddress: z
    .string()
    .trim()
    .min(5, "Enter the complete registered address.")
    .max(500, "Registered address must be at most 500 characters."),
  ownerOrPocName: z
    .string()
    .trim()
    .min(2, "Enter the owner or contact person's name.")
    .max(120, "Name must be at most 120 characters."),
  ownerOrPocPhone: z
    .string()
    .trim()
    .min(8, "Enter a valid contact phone number.")
    .max(20, "Phone number must be at most 20 characters.")
    .regex(/^\+?[0-9][0-9\s-]+$/, "Enter a valid contact phone number."),
})

export const restaurantComplianceSchema = z.object({
  fssaiRegistrationNumber: z
    .string()
    .trim()
    .min(1, "FSSAI registration number is required."),
  gstRegistrationNumber: z.string().trim(),
  tradeLicenseNumber: z.string().trim(),
})

export const restaurantBankSchema = z.object({
  bankName: z.string().trim().min(2, "Enter the bank name."),
  accountNumber: z.string().trim().min(4, "Enter the account number."),
  ifsc: z.string().trim().min(4, "Enter the IFSC code."),
})

export const restaurantEntityTypes = [
  { label: "Sole proprietorship", value: "sole_proprietorship" },
  { label: "Partnership", value: "partnership" },
  { label: "Limited liability partnership", value: "llp" },
  { label: "Private limited company", value: "private_limited" },
  { label: "Public limited company", value: "public_limited" },
  { label: "Other", value: "other" },
] as const
