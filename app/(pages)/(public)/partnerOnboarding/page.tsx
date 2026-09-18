import { ArrowRightIcon, BikeIcon, CheckIcon, StoreIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { RestaurantOwnerHeader } from "@/components/customer-homepage/site-header"
import { containerWidth } from "@/components/extras/classname-extras"
import { Footer } from "@/components/footer/footer"
import { Button } from "@/components/ui/button"
import { currentProfile } from "@/lib/auth/current-profile"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Become a partner | FoodIO",
  description:
    "Find out how to join FoodIO as a restaurant owner or delivery partner.",
}

const partnerOptions = [
  {
    id: "restaurants",
    label: "For restaurant owners",
    title: "Bring your kitchen to FoodIO.",
    description:
      "Give your restaurant a place online where customers can discover your dishes and see what you serve.",
    icon: StoreIcon,
    benefits: [
      "Build a restaurant profile with your location and cuisine.",
      "Add your dishes, prices, and serving times in one place.",
      "Start with the free plan and choose a plan as your business grows.",
    ],
    steps: [
      "Create your owner account and verify your email.",
      "Add your restaurant, business, compliance, and bank details.",
      "Add your menu and submit your restaurant for review.",
    ],
    signup: "/signup/restraurant",
    login: "/login/restaurant",
    button: "Join as a restaurant owner",
    loginLabel: "Restaurant owner login",
  },
  {
    id: "delivery",
    label: "For delivery partners",
    title: "Be part of the journey to the door.",
    description:
      "Interested in helping food from local kitchens reach customers? Create your FoodIO delivery partner account to get started.",
    icon: BikeIcon,
    benefits: [
      "Join the delivery side of your local food community.",
      "Get a dedicated delivery partner account.",
      "Use your existing FoodIO account if you already have one.",
    ],
    steps: [
      "Sign up as a delivery partner, or sign in to your existing account.",
      "Verify your email to complete your account registration.",
      "Access FoodIO with your delivery partner account.",
    ],
    signup: "/signup/delivery",
    login: "/login/delivery",
    button: "Join as a delivery partner",
    loginLabel: "Delivery partner login",
  },
] as const

export default async function PartnerOnboardingPage() {
  const profile = await currentProfile()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <RestaurantOwnerHeader profile={profile} />
      <main className={cn(containerWidth, "py-12 sm:py-20")}>
        <section className="max-w-3xl" aria-labelledby="partner-heading">
          <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
            Partner with FoodIO
          </p>
          <h1
            id="partner-heading"
            className="font-heading text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Good food starts with people like you.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Whether you run a restaurant or want to join as a delivery partner,
            there is a place for you at FoodIO. Choose how you would like to
            join.
          </p>
        </section>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {partnerOptions.map((partner) => (
            <section
              key={partner.id}
              aria-labelledby={`${partner.id}-heading`}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <partner.icon className="size-6" aria-hidden="true" />
                </span>
                <p className="text-sm font-medium text-muted-foreground">
                  {partner.label}
                </p>
              </div>
              <h2
                id={`${partner.id}-heading`}
                className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl"
              >
                {partner.title}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {partner.description}
              </p>

              <h3 className="mt-8 text-base font-semibold">Why join FoodIO?</h3>
              <ul className="mt-4 space-y-3">
                {partner.benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-sm leading-6">
                    <CheckIcon
                      className="mt-1 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl bg-muted/50 p-5">
                <h3 className="text-base font-semibold">How to join</h3>
                <ol className="mt-4 space-y-4">
                  {partner.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-6">
                      <span
                        className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold"
                        aria-hidden="true"
                      >
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-auto pt-8">
                <Button
                  nativeButton={false}
                  size="lg"
                  className="h-auto min-h-11 w-full whitespace-normal py-3"
                  render={<Link href={partner.signup} />}
                >
                  {partner.button}
                  <ArrowRightIcon className="shrink-0" aria-hidden="true" />
                </Button>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Already joined?{" "}
                  <Link
                    href={partner.login}
                    className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
                  >
                    {partner.loginLabel}
                  </Link>
                </p>
              </div>
            </section>
          ))}
        </div>

        <p className="mt-8 text-sm leading-6 text-muted-foreground">
          Looking for a restaurant plan?{" "}
          <Link
            href="/pricing"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            Compare plans and limits
          </Link>
          .
        </p>
      </main>
      <Footer />
    </div>
  )
}
