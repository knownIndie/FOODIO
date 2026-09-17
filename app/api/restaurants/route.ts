import { handleOnboardingRequest } from "@/lib/restaurants/onboarding-request"

export async function POST(request: Request) {
  return handleOnboardingRequest(request)
}
