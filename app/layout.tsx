import { Geist_Mono, Nunito_Sans, Outfit } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-provider"
import { ThemeProvider } from "@/components/ui/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

const outfitHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "font-sans antialiased",
        fontMono.variable,
        nunitoSans.variable,
        outfitHeading.variable
      )}
    >
      <body>
        <CartProvider>
          <TooltipProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </TooltipProvider>
        </CartProvider>
      </body>
    </html>
  )
}
