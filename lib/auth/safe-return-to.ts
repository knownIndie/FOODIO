// Only allow paths inside this app, so ?returnTo= cannot send people to another site.
export function safeReturnTo(value?: string) {
  if (!value?.startsWith("/")) {
    return undefined
  }

  // "//host" and "/\host" are treated as links to another host by browsers.
  if (value.startsWith("//") || value.startsWith("/\\")) {
    return undefined
  }

  return value
}
