import { CustomerHeader } from "@/components/customer-homepage/site-header"
import { Footer } from "@/components/footer/footer"
import { CartProvider } from "@/components/cart/cart-provider"
import { currentProfile } from "@/lib/auth/current-profile"

export default async function CustomerLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = await currentProfile()
  return (
    <CartProvider>
      <div className="mx-auto flex min-h-svh flex-col bg-background">
        <CustomerHeader profile={profile} />

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}
