// this is used to check if the order the frontend is sending is valid and in the form that we expect and has correct structure
import z from "zod"
import { deliveryAddressSchema } from "../checkout/address-schema"

// strictObject is used to ensure that the object has no extra properties
const orderedItemSchema = z.strictObject({
  menuItemId: z.int32().positive(),
  quantity: z.int32().positive(),
})

export const orderSchemaCheck = z.strictObject({
  checkoutId: z.uuid(),
  restaurantId: z.uuid(),

  deliveryAddress: deliveryAddressSchema,
  // refine is used to allow a custom validation function to be used .refine(
  /*
.refine(
  validationFunction,
    {
      message: "Error message"
    }
  )
  */
  items: z
    .array(orderedItemSchema)
    .min(1)
    .max(50)
    .refine(
      (items) =>
        new Set(items.map((item) => item.menuItemId)).size === items.length,
      // we convert the array of menuItemIds to a array using map, then we convert that array to a Set, which removes duplicates, and then we check if the size of the Set is equal to the length of the original array. If they are not equal, it means there are duplicates in the original array, thus the error message is returned.
      {
        error: "Duplicate menuItemId found in items array",
      }
    ),
})

export type OrderSchemaCheck = z.infer<typeof orderSchemaCheck>
