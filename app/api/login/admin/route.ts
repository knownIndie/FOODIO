import { handleLoginRequest } from "@/lib/auth/login-request"

export function POST(request: Request) {
  return handleLoginRequest(request, {
    destination: "/dashboard/admin",
    portalName: "admin",
    requiredRole: "ADMIN",
  })
}
