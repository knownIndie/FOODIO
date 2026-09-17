"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  type RestaurantOnboardingInput,
  restaurantEntityTypes,
  restaurantOnboardingSchema,
} from "@/lib/restaurants/schema/restaurant-schema"
import { LeafletLocationPicker } from "./leaflet-location-picker"

type Values = Record<keyof RestaurantOnboardingInput, string>
type Errors = Partial<Record<keyof Values, string[]>>

type FormField = {
  name: keyof Values
  label: string
  optional?: boolean
  multiline?: boolean
}

const sections: { title: string; description: string; fields: FormField[] }[] =
  [
    {
      title: "Restaurant details",
      description:
        "Tell us about your restaurant and where customers can find it.",
      fields: [
        { name: "name", label: "Restaurant name" },
        {
          name: "description",
          label: "Description",
          optional: true,
          multiline: true,
        },
        { name: "phone", label: "Restaurant phone" },
        { name: "email", label: "Restaurant email", optional: true },
        { name: "address", label: "Restaurant address", multiline: true },
      ],
    },
    {
      title: "Business details",
      description:
        "Add the registered business and the person we should contact.",
      fields: [
        { name: "legalName", label: "Registered legal name" },
        { name: "entityType", label: "Business type" },
        {
          name: "registeredAddress",
          label: "Registered address",
          multiline: true,
        },
        { name: "ownerOrPocName", label: "Owner or contact name" },
        { name: "ownerOrPocPhone", label: "Contact phone" },
      ],
    },
    {
      title: "Compliance registrations",
      description: "Provide your FSSAI number and any optional registrations.",
      fields: [
        { name: "fssaiRegistrationNumber", label: "FSSAI registration number" },
        {
          name: "gstRegistrationNumber",
          label: "GST registration number",
          optional: true,
        },
        {
          name: "tradeLicenseNumber",
          label: "Trade license number",
          optional: true,
        },
      ],
    },
    {
      title: "Settlement account",
      description: "Enter the bank account for restaurant settlements.",
      fields: [
        { name: "bankName", label: "Bank name" },
        { name: "accountNumber", label: "Account number" },
        { name: "ifsc", label: "IFSC code" },
      ],
    },
  ]

const emptyValues: Values = {
  name: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  latitude: "",
  longitude: "",
  legalName: "",
  entityType: "",
  registeredAddress: "",
  ownerOrPocName: "",
  ownerOrPocPhone: "",
  fssaiRegistrationNumber: "",
  gstRegistrationNumber: "",
  tradeLicenseNumber: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
}

const testValues: Values = {
  name: "FoodIO Test Kitchen",
  description: "Freshly prepared meals from our test kitchen.",
  phone: "+91 98765 43210",
  email: "kitchen@example.com",
  address: "42 Residency Road, Bengaluru, Karnataka 560025",
  latitude: "12.9716",
  longitude: "77.5946",
  legalName: "FoodIO Test Kitchen Private Limited",
  entityType: "private_limited",
  registeredAddress: "42 Residency Road, Bengaluru, Karnataka 560025",
  ownerOrPocName: "Test Owner",
  ownerOrPocPhone: "+91 98765 43210",
  fssaiRegistrationNumber: "10023042001234",
  gstRegistrationNumber: "29ABCDE1234F1Z5",
  tradeLicenseNumber: "BBMP-TEST-2026-001",
  bankName: "Test Bank",
  accountNumber: "000012345678",
  ifsc: "TEST0001234",
}

export function RestaurantOnboardingForm({
  restaurantId,
  initialValues,
}: {
  restaurantId?: string
  initialValues?: Partial<Values>
}) {
  const router = useRouter()
  const [values, setValues] = useState<Values>({
    ...emptyValues,
    ...initialValues,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [review, setReview] = useState<RestaurantOnboardingInput | null>(null)
  const [error, setError] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationVersion, setLocationVersion] = useState(0)
  const submitting = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const initialLocation = useRef(
    initialValues?.latitude && initialValues.longitude
      ? {
          latitude: Number(initialValues.latitude),
          longitude: Number(initialValues.longitude),
        }
      : undefined
  )

  // Move keyboard focus to the heading when switching between editing and review.
  // biome-ignore lint/correctness/useExhaustiveDependencies: review changes the visible view.
  useEffect(() => {
    heading.current?.focus()
  }, [review])

  function fillTestDetails() {
    setValues({ ...testValues })
    setErrors({})
    setError(undefined)
    initialLocation.current = {
      latitude: Number(testValues.latitude),
      longitude: Number(testValues.longitude),
    }
    setLocationVersion((version) => version + 1)
  }

  function update(name: keyof Values, value: string) {
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
  }

  function reviewDetails() {
    setError(undefined)
    const parsed = restaurantOnboardingSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors)
      setError(
        "Check the highlighted fields before reviewing your application."
      )
      const first = parsed.error.issues[0]?.path[0]
      if (typeof first === "string") document.getElementById(first)?.focus()
      return
    }
    setErrors({})
    setReview(parsed.data)
  }

  async function submitApplication() {
    if (!review || submitting.current) return
    submitting.current = true
    setIsSubmitting(true)
    setError(undefined)
    try {
      const response = await fetch(
        restaurantId
          ? `/api/restaurants/${restaurantId}/submit`
          : "/api/restaurants",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(review),
        }
      )
      const result = (await response.json()) as {
        error?: string
        next?: string
        fieldErrors?: Errors
      }
      if (!response.ok || !result.next) {
        setError(result.error ?? "Could not submit your application.")
        if (result.fieldErrors) {
          setErrors(result.fieldErrors)
          setReview(null)
        }
        return
      }
      router.replace(result.next)
      router.refresh()
    } catch {
      setError(
        "Could not reach the server. Your details are still here. Please try again."
      )
    } finally {
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 pb-8">
      <header className="space-y-2">
        <p className="text-sm text-muted-foreground">Restaurant registration</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1
            ref={heading}
            tabIndex={-1}
            className="text-3xl font-semibold tracking-tight outline-none"
          >
            {review ? "Review your application" : "Register your restaurant"}
          </h1>
          {process.env.NODE_ENV === "development" && !review ? (
            <Button type="button" variant="secondary" onClick={fillTestDetails}>
              Fill test details
            </Button>
          ) : null}
        </div>
        <p className="text-muted-foreground">
          {review
            ? "Check your details. You can go back and edit before sending them for approval."
            : "Complete all details below, review them, then submit for approval."}
        </p>
      </header>
      {error ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}
      <form
        hidden={Boolean(review)}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          reviewDetails()
        }}
        className="space-y-6"
      >
        {sections.map((section, index) => (
          <fieldset
            key={section.title}
            className="min-w-0 rounded-2xl border bg-card p-5 sm:p-7"
          >
            <legend className="px-2 text-lg font-semibold">
              {section.title}
            </legend>
            <p className="mb-5 text-sm text-muted-foreground">
              {section.description}
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {section.fields.map(({ name, label, optional, multiline }) => {
                const props = {
                  id: name,
                  name,
                  value: values[name],
                  required: !optional,
                  "aria-invalid": Boolean(errors[name]),
                  "aria-describedby": errors[name]
                    ? `${name}-error`
                    : undefined,
                  onChange: (
                    event: React.ChangeEvent<
                      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                    >
                  ) => update(name, event.target.value),
                }
                return (
                  <div
                    key={name}
                    className={
                      multiline ? "space-y-2 sm:col-span-2" : "space-y-2"
                    }
                  >
                    <label htmlFor={name} className="text-sm font-medium">
                      {label}
                      {optional ? " (optional)" : ""}
                    </label>
                    {name === "entityType" ? (
                      <select
                        {...props}
                        className="h-10 w-full rounded-lg border bg-background px-3 text-sm"
                      >
                        <option value="">Select business type</option>
                        {restaurantEntityTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    ) : multiline ? (
                      <Textarea {...props} rows={3} />
                    ) : (
                      <Input
                        {...props}
                        type={
                          name === "email"
                            ? "email"
                            : name === "phone" || name === "ownerOrPocPhone"
                              ? "tel"
                              : "text"
                        }
                      />
                    )}
                    {errors[name] ? (
                      <p
                        id={`${name}-error`}
                        className="text-sm text-destructive"
                      >
                        {errors[name]?.[0]}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
            {index === 0 ? (
              <div className="mt-6 space-y-4">
                <h2 className="font-medium">Restaurant location</h2>
                <LeafletLocationPicker
                  key={locationVersion}
                  initialLocation={initialLocation.current}
                  onDraftChange={() => {
                    update("latitude", "")
                    update("longitude", "")
                  }}
                  onConfirm={(location) => {
                    update("latitude", String(location.latitude))
                    update("longitude", String(location.longitude))
                  }}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  {(["latitude", "longitude"] as const).map((name) => (
                    <div key={name} className="space-y-2">
                      <label htmlFor={name} className="text-sm font-medium">
                        {name === "latitude" ? "Latitude" : "Longitude"}
                      </label>
                      <Input
                        id={name}
                        value={values[name]}
                        readOnly
                        aria-invalid={Boolean(errors[name])}
                        aria-describedby={
                          errors[name] ? `${name}-error` : undefined
                        }
                        placeholder="Confirm a location on the map"
                      />
                      {errors[name] ? (
                        <p
                          id={`${name}-error`}
                          className="text-sm text-destructive"
                        >
                          Confirm your restaurant location on the map.
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </fieldset>
        ))}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Your changes are saved when you submit for approval.
          </p>
          <Button type="submit">Review application</Button>
        </div>
      </form>
      {review ? (
        <div className="space-y-6">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-2xl border bg-card p-5 sm:p-7"
            >
              <h2 className="mb-5 text-lg font-semibold">{section.title}</h2>
              <dl className="space-y-4">
                {section.fields.map(({ name, label }) => (
                  <div
                    key={name}
                    className="grid gap-1 sm:grid-cols-[12rem_1fr]"
                  >
                    <dt className="text-sm text-muted-foreground">{label}</dt>
                    <dd className="break-words text-sm font-medium">
                      {name === "accountNumber"
                        ? `•••• ${review.accountNumber.slice(-4)}`
                        : name === "entityType"
                          ? restaurantEntityTypes.find(
                              (type) => type.value === review.entityType
                            )?.label
                          : review[name] || "Not provided"}
                    </dd>
                  </div>
                ))}
                {index === 0 ? (
                  <div className="grid gap-1 sm:grid-cols-[12rem_1fr]">
                    <dt className="text-sm text-muted-foreground">Location</dt>
                    <dd className="text-sm">
                      {review.latitude}, {review.longitude}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>
          ))}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                setReview(null)
                setError(undefined)
              }}
            >
              Edit details
            </Button>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={submitApplication}
            >
              {isSubmitting ? "Submitting..." : "Submit for approval"}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
