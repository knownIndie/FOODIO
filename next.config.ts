import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const projectRoot = fileURLToPath(new URL(".", import.meta.url))

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
  outputFileTracingRoot: projectRoot,
}

export default nextConfig
