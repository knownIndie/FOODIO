"use client"

import { useForm } from "@tanstack/react-form"
import { FlaskConicalIcon, MapPinIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { restaurantBasicSchema } from "@/lib/restaurants/schema/restaurant-schema"
import { LeafletLocationPicker } from "../leaflet-location-picker"
import {
  FormAlert,
  type FormMessage,
  type RestaurantFormProps,
  SectionFormHeader,
  sectionFormContentClassName,
  sectionFormFooterClassName,
  showTestDetails,
} from "./form-shared"

const testBasicDetails = {
  phone: "+91 98765 43210",
  email: "foodio.test.restaurant@example.com",
  address: "42 Residency Road, Bengaluru, Karnataka 560025",
  latitude: "12.971600",
  longitude: "77.594600",
}

export function RestaurantBasicForm({ restaurantId }: RestaurantFormProps) {
  const router = useRouter()
  const [message, setMessage] = useState<FormMessage>()
  const form = useForm({
    defaultValues: {
      phone: "",
      email: "",
      address: "",
      latitude: "",
      longitude: "",
    },
    validators: { onSubmit: restaurantBasicSchema },
    onSubmit: async ({ value }) => {
      setMessage(undefined)
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/basic`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        })
        const data = (await response.json()) as {
          error?: string
          next?: string
        }
        if (!response.ok || !data.next) {
          setMessage({
            text: data.error ?? "Could not save the Basic details.",
            type: "error",
          })
          return
        }
        router.replace(data.next)
        router.refresh()
      } catch {
        setMessage({ text: "Could not reach the server.", type: "error" })
      }
    },
  })

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <SectionFormHeader
        icon={<MapPinIcon className="size-5" />}
        title="Restaurant basics"
        description="Add the public contact details and confirm the restaurant's exact location."
      />
      <CardContent className={sectionFormContentClassName}>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <form.Field name="phone">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Contact phone</FieldLabel>
                    <Input
                      id={field.name}
                      type="tel"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder="+91 98765 43210"
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>

            <form.Field name="email">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Restaurant email
                    </FieldLabel>
                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder="orders@restaurant.com"
                    />
                    <FieldDescription>
                      Optional and public-facing.
                    </FieldDescription>
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          </div>

          <form.Field name="address">
            {(field) => {
              const invalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>Full address</FieldLabel>
                  <Textarea
                    id={field.name}
                    className="min-h-28 resize-y"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    placeholder="Shop number, street, locality, city, state, postal code"
                  />
                  <FieldDescription>
                    The map confirms coordinates. It does not replace the
                    written address.
                  </FieldDescription>
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>

          <div className="space-y-4 rounded-xl border bg-muted/15 p-4 sm:p-5">
            <div>
              <p className="font-medium">Map location</p>
              <p className="text-sm text-muted-foreground">
                Place the pin at the restaurant and confirm it before
                continuing.
              </p>
            </div>
            <LeafletLocationPicker
              onConfirm={(location) => {
                form.setFieldValue("latitude", location.latitude.toFixed(6))
                form.setFieldValue("longitude", location.longitude.toFixed(6))
                setMessage({
                  text: "Restaurant location confirmed.",
                  type: "success",
                })
              }}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="latitude">
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Latitude</FieldLabel>
                    <Input id={field.name} value={field.state.value} readOnly />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="longitude">
                {(field) => (
                  <Field data-invalid={!field.state.meta.isValid}>
                    <FieldLabel htmlFor={field.name}>Longitude</FieldLabel>
                    <Input id={field.name} value={field.state.value} readOnly />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
            </div>
          </div>

          <FormAlert message={message} />
          <p className="text-xs text-muted-foreground">
            Unsubmitted changes are not saved if you leave this page.
          </p>
        </FieldGroup>
      </CardContent>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <CardFooter className={sectionFormFooterClassName}>
            {showTestDetails ? (
              <Button
                className="sm:mr-auto"
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={() => {
                  form.setFieldValue("phone", testBasicDetails.phone)
                  form.setFieldValue("email", testBasicDetails.email)
                  form.setFieldValue("address", testBasicDetails.address)
                  form.setFieldValue("latitude", testBasicDetails.latitude)
                  form.setFieldValue("longitude", testBasicDetails.longitude)
                  setMessage(undefined)
                }}
              >
                <FlaskConicalIcon data-icon="inline-start" />
                Fill test details
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => router.push("/dashboard")}
            >
              Exit setup
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save and continue"}
            </Button>
          </CardFooter>
        )}
      </form.Subscribe>
    </form>
  )
}
