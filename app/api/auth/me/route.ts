import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("foodio_access_token")?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const isVerified = await verifyAccessToken(token);
  if (!isVerified.authentication) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { profileId } = isVerified;

  return Response.json({ authentication: true, profileId }, { status: 200 });
}
