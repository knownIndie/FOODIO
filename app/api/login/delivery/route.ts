import { handleLoginRequest } from "@/lib/auth/login-request"

export function POST(request: Request) {
  return handleLoginRequest(request, {
    destination: "/dashboard/delivery",
    portalName: "delivery partner",
    requiredRole: "DELIVERY_PARTNER",
  })
}
