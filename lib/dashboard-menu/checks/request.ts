import "server-only"

import { menuBatchSchema } from "../schema"
import { MenuCheckError } from "./error"

export async function readMenuInput(request: Request) {
  // Read the JSON. Invalid JSON becomes null and fails validation below.
  const body = await request.json().catch(() => null)

  // Check dish names, prices, options, and the number of dishes.
  const result = menuBatchSchema.safeParse(body)
  if (!result.success) {
    throw new MenuCheckError(400, "Check the menu details and try again.")
  }

  return result.data
}
