"use client"

import { useForm } from "@tanstack/react-form"
import type { ChangeEvent, FormEvent } from "react"
import { Button } from "@/components/ui/button"
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
    inputMode: "text",
    placeholder: "Enter your full name",
    span: "sm:col-span-3",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    inputMode: "tel",
    placeholder: "Enter your 10-digit phone number",
    span: "sm:col-span-3",
  },
  {
    name: "billingAddress",
    label: "Delivery Address",
    type: "textarea",
    inputMode: "text",
    placeholder: "House or flat number, street, area, and landmark",
    span: "sm:col-span-6",
  },
  {
    name: "city",
    label: "City",
    type: "text",
    inputMode: "text",
    placeholder: "e.g. Bengaluru",
    span: "sm:col-span-2",
  },
  {
    name: "state",
    label: "State",
    type: "text",
    inputMode: "text",
    placeholder: "e.g. Karnataka",
    span: "sm:col-span-2",
  },
  {
    name: "postalCode",
    label: "PIN Code",
    type: "text",
    inputMode: "numeric",
    placeholder: "Enter your 6-digit PIN code",
    span: "sm:col-span-2",
  },
] as const

const testDeliveryAddress: deliveryAddress = {
  customerName: "Test Customer",
  phone: "9876543210",
  billingAddress: "12 Test Street, Sample Area",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560001",
}

type DeliveryAddressFormProps = {
  initialAddress: deliveryAddress | null
  onConfirm: (address: deliveryAddress) => void
  onCancel?: () => void
}

export function DeliveryAddressForm({
  initialAddress,
  onConfirm,
  onCancel,
}: DeliveryAddressFormProps) {
  const form = useForm({
    // Edits stay in this form until the user confirms the address.
    defaultValues: initialAddress ?? {
      customerName: "",
      phone: "",
      billingAddress: "",
      city: "",
      state: "",
      postalCode: "",
    },
    validators: {
      onChange: deliveryAddressSchema,
      onSubmit: deliveryAddressSchema,
    },
    onSubmit: ({ value }) => {
      // Validation has passed. Parse once more to apply the schema's trimming.
      onConfirm(deliveryAddressSchema.parse(value))
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void form.handleSubmit()
  }

  function handleFillTestDetails() {
    for (const { name } of addressFields) {
      form.setFieldValue(name, testDeliveryAddress[name])
    }
    void form.validate("change")
  }

  return (
    <form className="w-full text-zinc-700" noValidate onSubmit={handleSubmit}>
      <FieldGroup className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
        {addressFields.map(
          ({ name, label, type, inputMode, placeholder, span }) => (
            <form.Field key={name} name={name}>
              {(field) => {
                const hasError =
                  field.state.meta.isTouched && !field.state.meta.isValid
                const inputId = `delivery-${field.name}`
                const errorId = `${inputId}-error`
                const inputProps = {
                  id: inputId,
                  name: field.name,
                  placeholder,
                  value: field.state.value,
                  onChange: (
                    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                  ) => field.handleChange(event.target.value),
                  onBlur: field.handleBlur,
                  "aria-invalid": hasError,
                  "aria-describedby": hasError ? errorId : undefined,
                }

                return (
                  <Field data-invalid={hasError} className={`gap-2 ${span}`}>
                    <FieldLabel
                      htmlFor={inputId}
                      className="font-bold text-zinc-900"
                    >
                      {label}
                    </FieldLabel>
                    {type === "textarea" ? (
                      <Textarea
                        {...inputProps}
                        rows={2}
                        className="min-h-28 rounded-xl border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30"
                      />
                    ) : (
                      <Input
                        {...inputProps}
                        type={type}
                        inputMode={inputMode}
                        className="h-12 rounded-xl border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 placeholder:text-zinc-500 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30"
                      />
                    )}
                    {hasError && (
                      <FieldError
                        id={errorId}
                        className="text-red-700"
                        errors={field.state.meta.errors}
                      />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          )
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="grid gap-2 sm:col-span-6 sm:flex sm:flex-wrap">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-brand-green text-base font-bold text-white hover:bg-brand-green-hover focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 sm:w-auto sm:flex-1"
              >
                {isSubmitting ? "Checking..." : "Confirm address"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={onCancel}
                  className="h-12 w-full rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 sm:w-auto sm:flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleFillTestDetails}
                className="h-12 w-full rounded-xl border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 focus-visible:border-brand-orange focus-visible:ring-brand-orange/30 sm:w-auto sm:flex-1"
              >
                Add test details
              </Button>
            </div>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  )
}
