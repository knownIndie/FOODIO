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
  // {
  //   slug: "menu",
  //   label: "Menu",
  //   description: "Google Sheets menu import is coming soon",
  //   required: false,
  // },
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
  // menu: RestaurantSectionStatus
}

const requiredSectionSlugs = [
  "basic",
  "business",
  "compliance",
  "bank",
] as const

/*
  this function is essentially needed to calculate the progress of the restaurant setup
  it returns an object with the number of completed sections, the current section, and whether all required sections are complete and other status that is required to make the beautiful progress in section header
  */
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

/*
this is to make sure that the url maches the known slugs and not some user given
*/
export function isRestaurantSetupSection(
  section: string
): section is RestaurantSetupSection {
  return restaurantSetupSections.some((item) => item.slug === section)
}
/*
this function is to check if the user can visit a given section based on the current progress
*/
export function canVisitRestaurantSetupSection(
  section: RestaurantSetupSection,
  status: RestaurantSetupProgress
) {
  const progress = getRestaurantSetupProgress(status)

  if (section === "review") {
    return progress.allRequiredComplete
  }

  return section === progress.current
}
