"use client"

import { CircleCheckIcon, FlameIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type BillingPeriod = "monthly" | "yearly"

type PricingPlan = {
  billingNote?: Record<BillingPeriod, string>
  ctaHref: string
  ctaLabel: string
  description: string
  enterprise?: boolean
  features: string[]
  name: string
  popular?: boolean
  prices: Record<BillingPeriod, string>
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Free",
    prices: { monthly: "Free", yearly: "Free" },
    description: "For independent restaurant owners",
    features: [
      "Register up to 3 restaurants",
      "Restaurant profile and location setup",
      "Menu and opening-hours management",
      "Order management dashboard",
      "Standard email support",
    ],
    ctaLabel: "Start for free",
    ctaHref: "/signup/restraurant",
  },
  {
    name: "Premium",
    prices: { monthly: "$90", yearly: "$58.50" },
    billingNote: {
      monthly: "Per month, billed monthly",
      yearly: "Per month, $702 billed yearly",
    },
    description: "For growing restaurant groups",
    features: [
      "Register up to 10 restaurants",
      "Everything in Free",
      "Team access for restaurant staff",
      "Restaurant and order analytics",
      "Priority support",
    ],
    ctaLabel: "Choose Premium",
    ctaHref: "/signup/restraurant",
    popular: true,
  },
  {
    name: "Business",
    prices: { monthly: "$120", yearly: "$78" },
    billingNote: {
      monthly: "Per month, billed monthly",
      yearly: "Per month, $936 billed yearly",
    },
    description: "For multi-location restaurant businesses",
    features: [
      "Register up to 25 restaurants",
      "Everything in Premium",
      "Multi-location management controls",
      "Consolidated performance reports",
      "Priority onboarding and support",
    ],
    ctaLabel: "Choose Business",
    ctaHref: "/signup/restraurant",
  },
  {
    name: "Enterprise",
    prices: { monthly: "Custom", yearly: "Custom" },
    description: "For chains and large restaurant groups",
    features: [
      "Unlimited restaurant registrations",
      "Everything in Business",
      "Custom roles and permissions",
      "Dedicated onboarding",
      "Dedicated account support",
    ],
    ctaLabel: "Start enterprise setup",
    ctaHref: "/signup/restraurant",
    enterprise: true,
  },
]

const billingTriggerClassName =
  "h-8 min-w-24 rounded-full px-4 hover:bg-background/70 hover:text-foreground data-active:bg-foreground data-active:text-background data-active:hover:bg-foreground data-active:hover:text-background dark:data-active:border-transparent dark:data-active:bg-foreground dark:data-active:text-background dark:data-active:hover:bg-foreground dark:data-active:hover:text-background"

type PricingCardProps = {
  billingPeriod: BillingPeriod
  plan: PricingPlan
}

function PricingCard({ billingPeriod, plan }: PricingCardProps) {
  const isEnterprise = plan.enterprise === true
  const ctaClassName = cn(
    "h-9 w-full rounded-xl",
    isEnterprise
      ? "bg-background text-foreground hover:bg-background/90"
      : "bg-foreground text-background hover:bg-foreground/90"
  )

  return (
    <Card
      className={cn(
        "grid h-full min-h-[420px] grid-rows-[auto_1fr] rounded-2xl border-border/80 bg-card py-0 shadow-none",
        plan.popular && "border-2 border-primary bg-card ring-primary/20",
        isEnterprise &&
          "border-foreground/10 bg-foreground text-background [background-image:linear-gradient(to_right,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:45px_45px] dark:[background-image:linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]"
      )}
    >
      <CardHeader className="gap-7 px-6 pt-7">
        <div className="flex items-center gap-2">
          <h2
            className={cn(
              "font-heading text-lg font-medium",
              isEnterprise && "text-background"
            )}
          >
            {plan.name}
          </h2>
          {plan.popular && (
            <Badge className="pointer-events-none h-5 rounded-md bg-primary px-1.5 text-[11px] text-primary-foreground">
              <FlameIcon className="size-3 fill-current" aria-hidden="true" />
              Most Popular
            </Badge>
          )}
        </div>

        <div className="space-y-0.5">
          <p
            className={cn(
              "font-heading text-4xl font-normal tracking-tight sm:text-5xl",
              isEnterprise && "text-background"
            )}
          >
            {plan.prices[billingPeriod]}
          </p>
          {plan.billingNote && (
            <p
              className={cn(
                "text-xs text-muted-foreground",
                isEnterprise && "text-background/75"
              )}
            >
              {plan.billingNote[billingPeriod]}
            </p>
          )}
        </div>
      </CardHeader>

      <CardContent className="grid grid-rows-[1fr_auto] px-6 pt-8 pb-7">
        <div className="space-y-5">
          <p
            className={cn(
              "text-sm font-medium",
              isEnterprise ? "text-background/90" : "text-foreground"
            )}
          >
            {plan.description}
          </p>

          <ul className="space-y-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className={cn(
                  "flex items-start gap-2.5 text-shadow-2xs",
                  isEnterprise ? "text-background/80" : "text-muted-foreground"
                )}
              >
                <CircleCheckIcon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    isEnterprise
                      ? "text-background/75"
                      : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-8">
          <Button
            nativeButton={false}
            render={<Link href={plan.ctaHref} />}
            className={ctaClassName}
          >
            {plan.ctaLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export const PricingPageComponent = () => {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly")

  return (
    <section className="space-y-10">
      <header className="mx-auto max-w-3xl space-y-4 text-center">
        <h1 className="font-heading text-4xl font-normal tracking-tight sm:text-6xl">
          Plans and Pricing
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          Choose how many restaurants you want to manage. Pay yearly to save
          35%.
        </p>
      </header>

      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-border/80 bg-muted/40 p-1">
          <Tabs
            value={billingPeriod}
            onValueChange={(value) => {
              if (value === "monthly" || value === "yearly") {
                setBillingPeriod(value)
              }
            }}
            className="gap-0"
          >
            <TabsList
              aria-label="Billing period"
              className="h-9 bg-transparent p-0"
            >
              <TabsTrigger value="monthly" className={billingTriggerClassName}>
                Monthly
              </TabsTrigger>
              <TabsTrigger value="yearly" className={billingTriggerClassName}>
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Badge className="pointer-events-none h-7 rounded-full bg-foreground px-3 text-xs text-background">
            Save 35%
          </Badge>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-2">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.name}
            billingPeriod={billingPeriod}
            plan={plan}
          />
        ))}
      </div>
    </section>
  )
}
