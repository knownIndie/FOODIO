import { handleOnboardingRequest } from "@/lib/restaurants/onboarding-request"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  const { restaurantId } = await params
  return handleOnboardingRequest(request, restaurantId)
}
