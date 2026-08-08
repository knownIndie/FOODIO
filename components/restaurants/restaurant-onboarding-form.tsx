"use client"

import { useForm } from "@tanstack/react-form"
import { LocateFixedIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { restaurantFormSchema } from "@/lib/restaurants/restaurant-form-schema"

type FormMessage = {
  text: string
  type: "error" | "success"
}

const testRestaurantDetails = {
  name: "FoodIO Test Kitchen",
  phone: "+91 98765 43210",
  email: "foodio.restaurant.test@example.com",
  address: "12 Test Kitchen Road, Indiranagar, Bengaluru, Karnataka 560038",
  latitude: "12.971599",
  longitude: "77.594566",
  description: "Test restaurant used to verify the FoodIO onboarding process.",
}

export function RestaurantOnboardingForm() {
  const router = useRouter()
  const [message, setMessage] = useState<FormMessage>()
  const [isLocating, setIsLocating] = useState(false)

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      latitude: "",
      longitude: "",
      description: "",
    },
    validators: {
      onSubmit: restaurantFormSchema,
    },
    onSubmit: async ({ value }) => {
      setMessage(undefined)

      try {
        const response = await fetch("/api/restaurants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        })
        const data = (await response.json()) as {
          error?: string
          next?: string
          restaurant?: { id: number; name: string; status: string }
        }

        if (!response.ok || !data.restaurant) {
          setMessage({
            text: data.error ?? "Restaurant creation failed.",
            type: "error",
          })
          return
        }

        setMessage({
          text: `${data.restaurant.name} was saved as a draft.`,
          type: "success",
        })
        router.replace(data.next ?? "/dashboard")
        router.refresh()
      } catch {
        setMessage({
          text: "Could not reach the server. Try again.",
          type: "error",
        })
      }
    },
  })

  function useCurrentLocation() {
    setMessage(undefined)

    if (!navigator.geolocation) {
      setMessage({
        text: "This browser does not support location access.",
        type: "error",
      })
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setFieldValue("latitude", position.coords.latitude.toFixed(6))
        form.setFieldValue("longitude", position.coords.longitude.toFixed(6))
        setIsLocating(false)
        setMessage({
          text: "Current coordinates added. Confirm the written address.",
          type: "success",
        })
      },
      () => {
        setIsLocating(false)
        setMessage({
          text: "Location permission was denied or unavailable.",
          type: "error",
        })
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div className="grid gap-6 md:grid-cols-2">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Restaurant name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="organization"
                    placeholder="Spice House"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>

          <form.Field name="phone">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Contact phone</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="tel"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.Field>
        </div>

        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Restaurant email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  placeholder="orders@spicehouse.example"
                />
                <FieldDescription>
                  Optional. This can be different from your account email.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="address">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Full address</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="street-address"
                  placeholder="Shop number, street, locality, city, state, postal code"
                />
                <FieldDescription>
                  Location access fills coordinates, not the written address.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <div className="rounded-2xl border bg-muted/20 p-4">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">Map location</p>
              <p className="text-sm text-muted-foreground">
                Use the restaurant location, not your home location.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              disabled={isLocating}
              onClick={useCurrentLocation}
            >
              <LocateFixedIcon data-icon="inline-start" />
              {isLocating ? "Locating..." : "Use current location"}
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="latitude">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      step="any"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                      placeholder="12.971599"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="longitude">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      step="any"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                      placeholder="77.594566"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </div>
        </div>

        <form.Field name="description">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Tell customers what your restaurant is known for."
                />
                <FieldDescription>
                  Optional, up to 1,000 characters.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {message && (
          <p
            className={
              message.type === "success"
                ? "text-sm text-emerald-700"
                : "text-sm text-destructive"
            }
            role="status"
          >
            {message.text}
          </p>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  form.setFieldValue("name", testRestaurantDetails.name)
                  form.setFieldValue("phone", testRestaurantDetails.phone)
                  form.setFieldValue("email", testRestaurantDetails.email)
                  form.setFieldValue("address", testRestaurantDetails.address)
                  form.setFieldValue("latitude", testRestaurantDetails.latitude)
                  form.setFieldValue(
                    "longitude",
                    testRestaurantDetails.longitude
                  )
                  form.setFieldValue(
                    "description",
                    testRestaurantDetails.description
                  )
                  setMessage(undefined)
                }}
              >
                Fill test details
              </Button>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => router.push("/dashboard")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Saving restaurant..."
                    : "Save restaurant draft"}
                </Button>
              </div>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  )
}
