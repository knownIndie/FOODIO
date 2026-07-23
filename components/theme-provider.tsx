"use client"

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import * as React from "react"

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      storageKey="foodio-theme"
      disableTransitionOnChange
    >
      <SystemThemeSync />
      {children}
    </NextThemesProvider>
  )
}

function SystemThemeSync() {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    if (theme !== "system") {
      setTheme("system")
    }
  }, [setTheme, theme])

  return null
}

export { ThemeProvider }
