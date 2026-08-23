"use client"

import { useForm } from "@tanstack/react-form"
import { FlaskConicalIcon, LandmarkIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { restaurantBankSchema } from "@/lib/restaurants/schema/restaurant-schema"
import {
  FormAlert,
  type FormMessage,
  type RestaurantFormProps,
  SectionFormHeader,
  sectionFormContentClassName,
  sectionFormFooterClassName,
  showTestDetails,
} from "./form-shared"

const testBankDetails = {
  bankName: "HDFC Bank",
  accountNumber: "50100123456789",
  ifsc: "HDFC0001234",
}

export function RestaurantBankForm({ restaurantId }: RestaurantFormProps) {
  const router = useRouter()
  const [message, setMessage] = useState<FormMessage>()
  const form = useForm({
    defaultValues: { bankName: "", accountNumber: "", ifsc: "" },
    validators: { onSubmit: restaurantBankSchema },
    onSubmit: async ({ value }) => {
      setMessage(undefined)
      try {
        const response = await fetch(`/api/restaurants/${restaurantId}/bank`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        })
        const data = (await response.json()) as {
          error?: string
          next?: string
        }
        if (!response.ok || !data.next) {
          setMessage({
            text: data.error ?? "Could not save Bank details.",
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
        icon={<LandmarkIcon className="size-5" />}
        title="Settlement account"
        description="Add the bank account FoodIO should use for restaurant settlements."
      />
      <CardContent className={sectionFormContentClassName}>
        <Alert className="mb-5">
          <AlertDescription>
            Bank details are masked on Review. Account verification will be
            added separately.
          </AlertDescription>
        </Alert>
        <FieldGroup className="gap-5">
          <form.Field name="bankName">
            {(field) => {
              const invalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={invalid}>
                  <FieldLabel htmlFor={field.name}>Bank name</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    aria-invalid={invalid}
                    placeholder="HDFC Bank"
                  />
                  {invalid ? (
                    <FieldError errors={field.state.meta.errors} />
                  ) : null}
                </Field>
              )
            }}
          </form.Field>
          <div className="grid gap-5 md:grid-cols-2">
            <form.Field name="accountNumber">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Account number</FieldLabel>
                    <Input
                      id={field.name}
                      inputMode="numeric"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder="50100123456789"
                    />
                    {invalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                )
              }}
            </form.Field>
            <form.Field name="ifsc">
              {(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>IFSC</FieldLabel>
                    <Input
                      id={field.name}
                      className="uppercase"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={invalid}
                      placeholder="HDFC0001234"
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
                  form.setFieldValue("bankName", testBankDetails.bankName)
                  form.setFieldValue(
                    "accountNumber",
                    testBankDetails.accountNumber
                  )
                  form.setFieldValue("ifsc", testBankDetails.ifsc)
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
