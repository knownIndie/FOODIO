import "server-only";
import * as jose from "jose";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("startup/configuration error : verification not possible");
}

const jwtSecretBytes = new TextEncoder().encode(jwtSecret);

export async function signAccessToken(profileId: number): Promise<string> {
  const token = new jose.SignJWT({
    sub: profileId.toString(),
    tokenType: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("foodio")
    .setAudience("foodio-web")
    .setIssuedAt()
    .setExpirationTime("1m")

    .sign(jwtSecretBytes);
  return token;
}
