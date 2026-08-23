export type ServiceMode = "hosted" | "local"

export function getServiceMode(
  environment: NodeJS.ProcessEnv = process.env
): ServiceMode {
  const configuredMode = environment.SERVICE_MODE?.trim()

  if (!configuredMode) {
    return "hosted"
  }

  if (configuredMode !== "hosted" && configuredMode !== "local") {
    throw new Error(
      `SERVICE_MODE must be "hosted" or "local", received "${configuredMode}"`
    )
  }

  if (environment.VERCEL === "1" && configuredMode !== "hosted") {
    throw new Error("Vercel deployments must use SERVICE_MODE=hosted")
  }

  return configuredMode
}
