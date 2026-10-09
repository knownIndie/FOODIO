"use client"

import { useForm } from "@tanstack/react-form"
import { type ChangeEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  type deliveryAddress,
  deliveryAddressSchema,
} from "@/lib/checkout/address-schema"

const addressFields = [
  {
    name: "customerName",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter your 10-digit phone number",
  },
  {
    name: "billingAddress",
    label: "Billing Address",
    type: "textarea",
    placeholder: "House or flat number, street, area, and landmark",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    placeholder: "e.g. Bengaluru",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    placeholder: "e.g. Karnataka",
  },
  {
    name: "postalCode",
    label: "PIN Code",
    type: "text",
    placeholder: "Enter your 6-digit PIN code",
  },
] as const

// Sample values for checking the form. These do not create an order.
const testDeliveryAddress = {
  customerName: "Test Customer",
  phone: "9876543210",
  billingAddress: "12 Test Street, Sample Area",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560001",
} satisfies deliveryAddress

export function DeliveryAddressForm() {
  const [message, setMessage] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      customerName: "",
      phone: "",
      billingAddress: "",
      city: "",
      state: "",
      postalCode: "",
    } satisfies deliveryAddress,
    // `satisfies deliveryAddress` -> TypeScript checks whether the object matches the inferred type. If  misspell customerName, for example, TypeScript will report an error.

    validators: {
      onBlur: deliveryAddressSchema,
      onSubmit: deliveryAddressSchema,
      // we are telling form when to  run  Zod validation
      // We use onBlur and onSubmit so the form does not need to show errors with every keystroke.
    },

    onSubmit: async ({ value }) => {
      setMessage(`Address checked for ${value.customerName}.`)
      console.log(value)
    },
  })

  return (
    <form
      className="mx-auto w-full max-w-2xl"
      noValidate
      // stop the browser from doing its own validation and showing its own error messages.
      onSubmit={(e) => {
        e.preventDefault()
        // stops the browser from reloading the page when the form is submitted.
        e.stopPropagation()
        // stops the event from bubbling up to parent elements,i.e -> stops the actions form moving to parent elemet which could trigger other event handlers.
        void form.handleSubmit()
        // calls the form's handleSubmit method, which will run validation and call the onSubmit function if the form is valid.
      }}
    >
      {/* Reuse the same card and field components as the login forms. */}
      <Card className="border border-border/70 shadow-xl shadow-foreground/5">
        <CardHeader className="gap-1.5">
          <CardTitle>
            <h2 className="text-2xl">Billing address</h2>
          </CardTitle>
          <CardDescription>
            Enter your billing address and contact details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Keep shared field spacing and use two columns on wider screens. */}
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2">
            {addressFields.map(({ name, label, type, placeholder }) => (
              <form.Field key={name} name={name}>
                {(field) => {
                  const hasError =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  const inputId = `delivery-${field.name}`
                  const errorId = `${inputId}-error`

                  // Both input types read and update the same TanStack state.
                  const inputProps = {
                    id: inputId,
                    name: field.name,
                    placeholder,
                    value: field.state.value,
                    onChange: (
                      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => {
                      // Remove the previous success message after an edit.
                      setMessage(null)
                      field.handleChange(event.target.value)
                    },
                    onBlur: field.handleBlur,
                    "aria-invalid": hasError,
                    // Connect the field to its message for screen readers.
                    "aria-describedby": hasError ? errorId : undefined,
                  }

                  return (
                    // The combined address uses the full width of the form.
                    <Field
                      data-invalid={hasError}
                      className={
                        name === "billingAddress" ? "sm:col-span-2" : undefined
                      }
                    >
                      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>

                      {type === "textarea" ? (
                        <Textarea {...inputProps} rows={3} />
                      ) : (
                        <Input
                          {...inputProps}
                          type={type}
                          inputMode={
                            name === "postalCode"
                              ? "numeric"
                              : name === "phone"
                                ? "tel"
                                : undefined
                          }
                        />
                      )}

                      {hasError && (
                        <FieldError
                          id={errorId}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
            ))}
            {message ? (
              // Match the success used by the signup form.
              <p
                role="status"
                className="text-sm text-emerald-700 sm:col-span-2"
              >
                {message}
              </p>
            ) : null}
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div className="grid gap-2 sm:col-span-2">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Checking..." : "Use this address"}
                  </Button>
                  <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => {
                      // Update TanStack's values so the inputs show the samples.
                      for (const { name } of addressFields) {
                        form.setFieldValue(name, testDeliveryAddress[name])
                      }
                      // Clear old feedback and recheck any displayed errors.
                      setMessage(null)
                      void form.validate("blur")
                    }}
                  >
                    Fill test details
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}
