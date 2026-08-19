export const restaurantSetupSections = [
  {
    slug: "basic",
    label: "Basic",
    description: "Contact details and restaurant location",
    required: true,
  },
  {
    slug: "business",
    label: "Business",
    description: "Legal entity and primary contact",
    required: true,
  },
  {
    slug: "compliance",
    label: "Compliance",
    description: "FSSAI and optional registrations",
    required: true,
  },
  {
    slug: "bank",
    label: "Bank",
    description: "Settlement account details",
    required: true,
  },
  {
    slug: "menu",
    label: "Menu",
    description: "Google Sheets menu import is coming soon",
    required: false,
  },
  {
    slug: "review",
    label: "Review",
    description: "Confirm and submit your restaurant",
    required: false,
  },
] as const

export type RestaurantSetupSection =
  (typeof restaurantSetupSections)[number]["slug"]

export type RestaurantSectionStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"

export type RestaurantSetupProgress = {
  basic: RestaurantSectionStatus
  business: RestaurantSectionStatus
  compliance: RestaurantSectionStatus
  bank: RestaurantSectionStatus
  menu: RestaurantSectionStatus
}

const requiredSectionSlugs = [
  "basic",
  "business",
  "compliance",
  "bank",
] as const

export function getRestaurantSetupProgress(status: RestaurantSetupProgress) {
  const completed = requiredSectionSlugs.filter(
    (section) => status[section] === "COMPLETED"
  ).length
  const current =
    requiredSectionSlugs.find((section) => status[section] !== "COMPLETED") ??
    "review"

  return {
    completed,
    total: requiredSectionSlugs.length,
    current,
    allRequiredComplete: completed === requiredSectionSlugs.length,
  }
}

export function isRestaurantSetupSection(
  section: string
): section is RestaurantSetupSection {
  return restaurantSetupSections.some((item) => item.slug === section)
}

export function canVisitRestaurantSetupSection(
  section: RestaurantSetupSection,
  status: RestaurantSetupProgress
) {
  const progress = getRestaurantSetupProgress(status)

  if (section === "menu" || section === "review") {
    return progress.allRequiredComplete
  }

  return section === progress.current
}
