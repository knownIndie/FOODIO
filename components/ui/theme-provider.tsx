"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type * as React from "react"

// FoodIO is light-only: every page is designed on the light palette in
// app/globals.css, so the theme is forced to light regardless of the OS setting.
function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      forcedTheme="light"
      enableSystem={false}
      enableColorScheme
      storageKey="foodio-theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}

export { ThemeProvider }
