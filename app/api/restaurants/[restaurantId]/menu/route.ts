import { requireMenuOwnerAccount } from "@/lib/dashboard-menu/checks/account"
import { MenuCheckError } from "@/lib/dashboard-menu/checks/error"
import { readMenuInput } from "@/lib/dashboard-menu/checks/request"
import { checkRestaurantId } from "@/lib/dashboard-menu/checks/restaurant"
import { addMenuItems } from "@/lib/dashboard-menu/commands"

type RouteContext = { params: Promise<{ restaurantId: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  try {
    // Check the account first. The caller's profile ID comes from the session.
    const profile = await requireMenuOwnerAccount()
    const { restaurantId } = await params
    const validRestaurantId = checkRestaurantId(restaurantId)
    const input = await readMenuInput(request)

    // The command checks restaurant ownership inside its database transaction.
    const createdCount = await addMenuItems(
      profile.id,
      validRestaurantId,
      input
    )
    return Response.json({ success: true, createdCount }, { status: 201 })
  } catch (error) {
    // All failed checks use the same error type, so we handle them in one place.
    if (error instanceof MenuCheckError) {
      return Response.json(
        { success: false, error: error.message },
        { status: error.status }
      )
    }
    console.error("Menu creation failed.", error)
    return Response.json(
      { success: false, error: "Could not save the menu items. Try again." },
      { status: 500 }
    )
  }
}
