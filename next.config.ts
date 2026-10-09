import { fileURLToPath } from "node:url"
import type { NextConfig } from "next"

const projectRoot = fileURLToPath(new URL(".", import.meta.url))

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    // Reusing the old dev disk cache caused rapid PostCSS worker and RAM growth.
    // Keep Turbopack's in-session cache, but do not restore its disk snapshots.
    turbopackFileSystemCacheForDev: false,
  },
  outputFileTracingRoot: projectRoot,
}

export default nextConfig
