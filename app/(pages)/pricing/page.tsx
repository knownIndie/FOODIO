import { RestaurantOwnerHeader } from "@/components/customer-homepage/site-header"
import { containerWidth } from "@/components/extras/classname-extras"
import { Footer } from "@/components/footer/footer"
import { PricingPageComponent } from "@/components/pricing/pricing-page"
import { currentProfile } from "@/lib/auth/current-profile"
import { cn } from "@/lib/utils"

export default async function PricingPage() {
  const profile = await currentProfile()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <RestaurantOwnerHeader profile={profile} />
      <main className={cn(containerWidth, "py-12 sm:py-16")}>
        <PricingPageComponent />
      </main>
      <Footer />
    </div>
  )
}
