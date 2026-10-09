import z from "zod"

export const deliveryAddressSchema = z.object({
  customerName: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(30, "Name must be at most 30 characters"),
  phone: z.string().regex(/^\d{10}$/, "Enter a 10-digit phone number."),
  // the regex above checks for exactly 10 digits.
  // Store both former address lines in one required field.
  billingAddress: z
    .string()
    .trim()
    .min(1, "Billing address is required")
    .max(400, "Keep the billing address under 401 characters"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  postalCode: z.string().regex(/^[1-9]\d{5}$/, "Enter a 6-digit postal code."),
  // the regex above checks for exactly 6 digits.
})

export type deliveryAddress = z.infer<typeof deliveryAddressSchema>
// this is so that later on we can use the type in our code
