import { handleLoginRequest } from "@/lib/auth/login-request"

export function POST(request: Request) {
  return handleLoginRequest(request, {
    destination: "/dashboard",
    portalName: "restaurant owner",
    requiredRole: "RESTAURANT_OWNER",
  })
}
