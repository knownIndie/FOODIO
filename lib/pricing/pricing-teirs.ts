export const pricingTiers = [
  {
    id: 1,
    planName: "free",
    planPrice: 0,
    staffLimit: 15,
    restaurantLimit: 3,
  },
  {
    id: 2,
    planName: "Premium",
    planPrice: 0,
    staffLimit: 100,
    restaurantLimit: 10,
  },
  {
    id: 3,
    planName: "Business",
    planPrice: 0,
    staffLimit: 250,
    restaurantLimit: 25,
  },
] as const
export type PricingTier = (typeof pricingTiers)[number]
