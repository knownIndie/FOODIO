"use client"

import { useForm } from "@tanstack/react-form"
import { Building2Icon, FlaskConicalIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  restaurantBusinessSchema,
  restaurantEntityTypes,
} from "@/lib/restaurants/schema/restaurant-schema"
import {
  FormAlert,
  type FormMessage,
  type RestaurantFormProps,
  SectionFormHeader,
  sectionFormContentClassName,
  sectionFormFooterClassName,
  showTestDetails,
} from "./form-shared"

const testBusinessDetails = {
  legalName: "FoodIO Test Kitchen Private Limited",
  entityType: "private_limited" as const,
  registeredAddress: "42 Residency Road, Bengaluru, Karnataka 560025",
  ownerOrPocName: "Aarav Sharma",
  ownerOrPocPhone: "+91 98123 45678",
}

export function RestaurantBusinessForm({ restaurantId }: RestaurantFormProps) {
  const router = useRouter()
  const [message, setMessage] = useState<FormMessage>()
  const form = useForm({
    defaultValues: {
      legalName: "",
      entityType: "" as (typeof restaurantEntityTypes)[number]["value"] | "",
      registeredAddress: "",
      ownerOrPocName: "",
      ownerOrPocPhone: "",
    },
    validators: { onSubmit: restaurantBusinessSchema },
    onSubmit: async ({ value }) => {
      setMessage(undefined)
      try {
        const response = await fetch(
          `/api/restaurants/${restaurantId}/business`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value),
          }
        )
        const data = (await response.json()) as {
          error?: string
          next?: string
        }
        if (!response.ok || !data.next) {
          setMessage({
            text: data.error ?? "Could not save Business details.",
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
        icon={<Building2Icon className="size-5" />}
        title="Business details"
        description="Tell us how the restaurant is legally registered and who manages this account."
      />
      <CardContent className={sectionFormContentClassName}>
        <FieldGroup className="gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <form.Field name="legalName">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Registered legal name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder="FoodIO Test Kitchen Private Limited"
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="entityType">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel>Entity type</FieldLabel>
                    <Select
                      value={field.state.value || null}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                    >
                      <SelectTrigger className="w-full" aria-invalid={invalid}>
                        <SelectValue placeholder="Select an entity type" />
                      </SelectTrigger>
                      <SelectContent>
                        {restaurantEntityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          </div>

          <form.Field name="registeredAddress">
            {(field) => {
              const invalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Registered address
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    className="min-h-28 resize-y"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    placeholder="Registered office address"
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>

          <div className="grid gap-5 md:grid-cols-2">
            <form.Field name="ownerOrPocName">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>
                      Owner or contact person
                    </FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder="Aarav Sharma"
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="ownerOrPocPhone">
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
                      placeholder="+91 98123 45678"
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
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
                  form.setFieldValue("legalName", testBusinessDetails.legalName)
                  form.setFieldValue(
                    "entityType",
                    testBusinessDetails.entityType
                  )
                  form.setFieldValue(
                    "registeredAddress",
                    testBusinessDetails.registeredAddress
                  )
                  form.setFieldValue(
                    "ownerOrPocName",
                    testBusinessDetails.ownerOrPocName
                  )
                  form.setFieldValue(
                    "ownerOrPocPhone",
                    testBusinessDetails.ownerOrPocPhone
                  )
                  setMessage(undefined)
                }}
              >
                <FlaskConicalIcon data-icon="inline-start" />
                Fill test details
              </Button>
            ) : null}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save and continue"}
            </Button>
          </CardFooter>
        )}
      </form.Subscribe>
    </form>
  )
}
