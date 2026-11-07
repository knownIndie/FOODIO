import { redirect } from "next/navigation"
import { RestaurantOnboardingForm } from "@/components/restaurants/restaurant-onboarding-form"
import { getCurrentRestaurant } from "@/lib/restaurants/current-restaurant"

export default async function RestaurantSetupPage({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params
  const data = await getCurrentRestaurant(restaurantId)
  if (data.restaurant.status !== "DRAFT")
    redirect(`/dashboard/restaurants/${restaurantId}`)
  const registration = (type: string) =>
    data.compliance.find((item) => item.type === type)?.registrationNumber ?? ""
  return (
    <RestaurantOnboardingForm
      restaurantId={restaurantId}
      initialValues={{
        name: data.restaurant.name,
        description: data.restaurant.description ?? "",
        phone: data.restaurant.phone ?? "",
        email: data.restaurant.email ?? "",
        address: data.restaurant.address ?? "",
        latitude: data.restaurant.latitude?.toString() ?? "",
        longitude: data.restaurant.longitude?.toString() ?? "",
        legalName: data.business?.legalName ?? "",
        entityType: data.business?.entityType ?? "",
        registeredAddress: data.business?.registeredAddress ?? "",
        ownerOrPocName: data.business?.ownerOrPocName ?? "",
        ownerOrPocPhone: data.business?.ownerOrPocPhone ?? "",
        fssaiRegistrationNumber: registration("FSSAI"),
        gstRegistrationNumber: registration("GST"),
        tradeLicenseNumber: registration("TRADE_LICENSE"),
        bankName: data.bank?.bankName ?? "",
        accountNumber: data.bank?.accountNumber ?? "",
        ifsc: data.bank?.ifsc ?? "",
      }}
    />
  )
}
