import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("foodio_access_token")?.value;
  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const isVerified = await verifyAccessToken(token);
    if (!isVerified.success) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { profileId } = isVerified;

    return Response.json({ status: 200, msg: "Authorized", profileId });
  } catch (error) {
    if (error instanceof Error)
      return Response.json(
        { error: "we coudn't verify your account" },
        { status: 401 },
      );
  }
}
