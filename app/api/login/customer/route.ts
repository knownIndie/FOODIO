import { handleLoginRequest } from "@/lib/auth/login-request"

export function POST(request: Request) {
  return handleLoginRequest(request, {
    destination: "/customer",
    portalName: "customer",
    requiredRole: "CUSTOMER",
  })
}
