import { containerWidth } from "@/components/classname-extras"
import { SiteHeader } from "@/components/home/site-header"
import { PricingPageComponent } from "@/components/pricing/pricing-page"
import { currentProfile } from "@/lib/auth/current-profile"
import { cn } from "@/lib/utils"

export default async function PricingPage() {
  const profile = await currentProfile()

  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader profile={profile} />
      <main className={cn(containerWidth, "py-12 sm:py-16")}>
        <PricingPageComponent />
      </main>
    </div>
  )
}
