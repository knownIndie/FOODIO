"use client"

import { ChevronDownIcon, FileSpreadsheetIcon, SendIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"

type ReviewData = {
  restaurant: {
    id: string
    name: string
    description: string | null
    phone: string | null
    email: string | null
    address: string | null
    latitude: number | null
    longitude: number | null
  }
  business: {
    legalName: string
    entityType: string
    registeredAddress: string
    ownerOrPocName: string
    ownerOrPocPhone: string
  } | null
  compliance: Array<{ type: string; registrationNumber: string }>
  bank: { bankName: string; accountNumber: string; ifsc: string } | null
}

function ReviewSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-4 text-left font-medium [&[data-panel-open]_[data-icon]]:rotate-180">
        {title}
        <ChevronDownIcon data-icon className="size-4 transition-transform" />
      </CollapsibleTrigger>
      <CollapsibleContent className="grid gap-3 pb-5 text-sm">
        {children}
      </CollapsibleContent>
      <Separator />
    </Collapsible>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[12rem_1fr]">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium break-words">{value || "Not provided"}</span>
    </div>
  )
}

export function RestaurantMenuPlaceholder({
  restaurantId,
}: {
  restaurantId: string
}) {
  return (
    <>
      <CardHeader className="border-b">
        <div className="mb-2 flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileSpreadsheetIcon className="size-5" />
        </div>
        <CardTitle className="text-xl">Menu import is coming next</CardTitle>
        <CardDescription>
          FoodIO will import menu data from Google Sheets. This optional step is
          not required to submit the restaurant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Basic, Business, Compliance, and Bank are complete. Continue to
            Review without adding menu items.
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <Button
          nativeButton={false}
          render={
            <Link
              href={`/dashboard/restaurants/${restaurantId}/setup/review`}
            />
          }
        >
          Continue to Review
        </Button>
      </CardFooter>
    </>
  )
}

export function RestaurantReviewSummary({ data }: { data: ReviewData }) {
  const router = useRouter()
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const maskedAccount = data.bank?.accountNumber
    ? `•••• ${data.bank.accountNumber.slice(-4)}`
    : null

  async function submitRestaurant() {
    setError(undefined)
    setIsSubmitting(true)
    try {
      const response = await fetch(
        `/api/restaurants/${data.restaurant.id}/submit`,
        { method: "POST" }
      )
      const result = (await response.json()) as {
        error?: string
        next?: string
      }
      if (!response.ok || !result.next) {
        setError(result.error ?? "Could not submit the restaurant.")
        return
      }
      router.replace(result.next)
      router.refresh()
    } catch {
      setError("Could not reach the server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-6 pt-4">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Review your restaurant</CardTitle>
        <CardDescription>
          This summary is read-only. You can update restaurant details after
          account creation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReviewSection title="Restaurant overview">
          <ReviewRow label="Restaurant name" value={data.restaurant.name} />
          <ReviewRow label="Description" value={data.restaurant.description} />
          <ReviewRow label="Phone" value={data.restaurant.phone} />
          <ReviewRow label="Email" value={data.restaurant.email} />
          <ReviewRow label="Address" value={data.restaurant.address} />
          <ReviewRow
            label="Coordinates"
            value={
              data.restaurant.latitude !== null &&
              data.restaurant.longitude !== null
                ? `${data.restaurant.latitude}, ${data.restaurant.longitude}`
                : null
            }
          />
        </ReviewSection>
        <ReviewSection title="Business details">
          <ReviewRow label="Legal name" value={data.business?.legalName} />
          <ReviewRow
            label="Entity type"
            value={data.business?.entityType.replaceAll("_", " ")}
          />
          <ReviewRow
            label="Registered address"
            value={data.business?.registeredAddress}
          />
          <ReviewRow
            label="Owner or contact"
            value={data.business?.ownerOrPocName}
          />
          <ReviewRow
            label="Contact phone"
            value={data.business?.ownerOrPocPhone}
          />
        </ReviewSection>
        <ReviewSection title="Compliance registrations">
          {data.compliance.map((item) => (
            <ReviewRow
              key={item.type}
              label={item.type.replaceAll("_", " ")}
              value={item.registrationNumber}
            />
          ))}
        </ReviewSection>
        <ReviewSection title="Settlement account">
          <ReviewRow label="Bank" value={data.bank?.bankName} />
          <ReviewRow label="Account number" value={maskedAccount} />
          <ReviewRow label="IFSC" value={data.bank?.ifsc} />
        </ReviewSection>
        {error && (
          <Alert variant="destructive" className="mt-5">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="justify-end border-t p-4 items-center">
        <Button onClick={submitRestaurant} disabled={isSubmitting}>
          <SendIcon data-icon="inline-start" />
          {isSubmitting ? "Submitting..." : "Submit for review"}
        </Button>
      </CardFooter>
    </div>
  )
}
