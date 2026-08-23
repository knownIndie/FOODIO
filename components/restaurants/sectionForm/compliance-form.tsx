"use client"

import { useForm } from "@tanstack/react-form"
import { FlaskConicalIcon, ShieldCheckIcon } from "lucide-react"
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
import { restaurantComplianceSchema } from "@/lib/restaurants/schema/restaurant-schema"
import {
  FormAlert,
  type FormMessage,
  type RestaurantFormProps,
  SectionFormHeader,
  sectionFormContentClassName,
  sectionFormFooterClassName,
  showTestDetails,
} from "./form-shared"

const testComplianceDetails = {
  fssaiRegistrationNumber: "10023042001234",
  gstRegistrationNumber: "29ABCDE1234F1Z5",
  tradeLicenseNumber: "BBMP-TEST-2026-001",
}

const complianceFields = [
  {
    name: "fssaiRegistrationNumber",
    label: "FSSAI registration number",
    description: "Required for restaurant onboarding.",
    placeholder: "10023042001234",
  },
  {
    name: "gstRegistrationNumber",
    label: "GST registration number",
    description: "Optional. Add it only if the restaurant is registered.",
    placeholder: "29ABCDE1234F1Z5",
  },
  {
    name: "tradeLicenseNumber",
    label: "Trade license number",
    description: "Optional for this onboarding step.",
    placeholder: "BBMP-2026-001",
  },
] as const

export function RestaurantComplianceForm({
  restaurantId,
}: RestaurantFormProps) {
  const router = useRouter()
  const [message, setMessage] = useState<FormMessage>()
  const form = useForm({
    defaultValues: {
      fssaiRegistrationNumber: "",
      gstRegistrationNumber: "",
      tradeLicenseNumber: "",
    },
    validators: { onSubmit: restaurantComplianceSchema },
    onSubmit: async ({ value }) => {
      setMessage(undefined)
      try {
        const response = await fetch(
          `/api/restaurants/${restaurantId}/compliances`,
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
            text: data.error ?? "Could not save Compliance details.",
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
        icon={<ShieldCheckIcon className="size-5" />}
        title="Compliance registrations"
        description="Add registration numbers now. Document uploads and verification can follow later."
      />
      <CardContent className={sectionFormContentClassName}>
        <FieldGroup className="gap-5">
          {complianceFields.map((item) => (
            <form.Field key={item.name} name={item.name}>
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>{item.label}</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder={item.placeholder}
                    />
                    <FieldDescription>{item.description}</FieldDescription>
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
          ))}
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
                  form.setFieldValue(
                    "fssaiRegistrationNumber",
                    testComplianceDetails.fssaiRegistrationNumber
                  )
                  form.setFieldValue(
                    "gstRegistrationNumber",
                    testComplianceDetails.gstRegistrationNumber
                  )
                  form.setFieldValue(
                    "tradeLicenseNumber",
                    testComplianceDetails.tradeLicenseNumber
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
