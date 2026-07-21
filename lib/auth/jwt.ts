import "server-only";
import * as jose from "jose";

const jwt_secret = process.env.JWT_SECRET;
if (!jwt_secret) {
  throw new Error("startup/configuration error : verification not possible");
}
