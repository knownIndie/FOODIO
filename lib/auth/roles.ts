export const PLATFORM_ROLES = [
  "CUSTOMER",
  "DELIVERY_PARTNER",
  "ADMIN",
  "SUPPORT",
] as const

export type PlatformRole = (typeof PLATFORM_ROLES)[number]
