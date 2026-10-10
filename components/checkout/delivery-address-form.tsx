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
    label: "Delivery Address",
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

type Props = {
  // When editing, start the draft with the last confirmed address.
  initialAddress: deliveryAddress | null
  // Only a successful confirmation changes the parent's saved address.
  onConfirm: (address: deliveryAddress) => void
  // Cancel closes the draft without changing the saved address.
  onCancel?: () => void
  showTestDetails?: boolean
  // The cart supplies its own card and heading.
  embedded?: boolean
}

export function DeliveryAddressForm({
  initialAddress,
  onConfirm,
  onCancel,
  showTestDetails = true,
  embedded = false,
}: Props) {
  const [message, setMessage] = useState<string | null>(null)

  const form = useForm({
    // The page mounts a fresh form for each edit. Its values are the draft.
    // TanStack updates this draft while the page keeps its confirmed copy.
    defaultValues:
      initialAddress ??
      ({
        customerName: "",
        phone: "",
        billingAddress: "",
        city: "",
        state: "",
        postalCode: "",
      } satisfies deliveryAddress),
    // `satisfies deliveryAddress` -> TypeScript checks whether the object matches the inferred type. If  misspell customerName, for example, TypeScript will report an error.

    validators: {
      onChange: deliveryAddressSchema,
      onSubmit: deliveryAddressSchema,
      // Revalidate edits so corrected errors clear before the submit button moves.
    },

    onSubmit: ({ value }) => {
      const data = deliveryAddressSchema.safeParse(value)
      if (!data.success) {
        setMessage("Please correct the errors in the form.")
        return
      }
      // Send the parsed output so trim() changes reach the parent too.
      // The page stores this address and replaces the form with a summary.
      onConfirm(data.data)
    },
  })

  return (
    <form
      className={embedded ? "w-full" : "mx-auto w-full max-w-2xl"}
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
      <Card
        className={
          embedded
            ? "gap-0 rounded-none border-0 bg-white p-0 text-zinc-700 shadow-none ring-0 dark:ring-0"
            : "border border-border/70 shadow-xl shadow-foreground/5"
        }
      >
        {!embedded ? (
          <CardHeader className="gap-1.5">
            <CardTitle>
              <h2 className="text-2xl">Delivery address</h2>
            </CardTitle>
            <CardDescription>
              Enter your delivery address and contact details.
            </CardDescription>
          </CardHeader>
        ) : null}

        <CardContent className={embedded ? "px-0" : undefined}>
          {/* Keep shared field spacing and use two columns on wider screens. */}
          <FieldGroup
            className={
              embedded
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                : "grid grid-cols-1 sm:grid-cols-2"
            }
          >
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
                      // Edits change only the draft. Cancel can still restore
                      // the parent's last confirmed address.
                      setMessage(null)

                      // Store the new text in TanStack Form.
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
                        embedded
                          ? name === "billingAddress"
                            ? "gap-2 sm:col-span-2"
                            : "gap-2"
                          : name === "billingAddress"
                            ? "sm:col-span-2"
                            : undefined
                      }
                    >
                      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>

                      {type === "textarea" ? (
                        <Textarea
                          {...inputProps}
                          rows={embedded ? 2 : 3}
                          className={
                            embedded
                              ? "min-h-20 rounded-xl border-zinc-300 bg-white text-sm text-zinc-700 placeholder:text-zinc-500 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 dark:bg-white"
                              : undefined
                          }
                        />
                      ) : (
                        <Input
                          {...inputProps}
                          type={type}
                          className={
                            embedded
                              ? "min-h-11 rounded-xl border-zinc-300 bg-white text-sm text-zinc-700 placeholder:text-zinc-500 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 dark:bg-white"
                              : undefined
                          }
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
                          className={embedded ? "text-red-700" : undefined}
                          errors={field.state.meta.errors}
                        />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
            ))}
            {message ? (
              // Report a parsing error without changing the confirmed address.
              <div className="sm:col-span-2">
                <span role="alert" className="text-sm text-destructive">
                  {message}
                </span>
              </div>
            ) : null}
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div
                  className={
                    embedded
                      ? "grid gap-2 sm:col-span-2 sm:flex sm:flex-wrap"
                      : "grid gap-2 sm:col-span-2"
                  }
                >
                  <Button
                    className={
                      embedded
                        ? "min-h-11 w-full rounded-xl bg-orange-700 text-white hover:bg-orange-800 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 sm:w-auto sm:flex-1"
                        : "w-full"
                    }
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Checking..." : "Confirm address"}
                  </Button>
                  {onCancel ? (
                    <Button
                      type="button"
                      variant="outline"
                      className={
                        embedded
                          ? "min-h-11 w-full rounded-xl border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-white dark:hover:bg-zinc-50 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 sm:w-auto sm:flex-1"
                          : undefined
                      }
                      disabled={isSubmitting}
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  ) : null}
                  {showTestDetails ? (
                    <Button
                      className={
                        embedded
                          ? "min-h-11 w-full rounded-xl border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-white dark:hover:bg-zinc-50 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 sm:w-auto sm:flex-1"
                          : "w-full"
                      }
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
                        void form.validate("change")
                      }}
                    >
                      Add test details
                    </Button>
                  ) : null}
                </div>
              )}
            </form.Subscribe>
          </FieldGroup>
        </CardContent>
      </Card>
    </form>
  )
}
