import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  distDir: process.env.FOODIO_DIST_DIR || ".next",
}

export default nextConfig
