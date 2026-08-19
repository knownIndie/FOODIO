"use client"

import { useForm } from "@tanstack/react-form"
import { FlaskConicalIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createRestaurantSchema } from "@/lib/restaurants/schema/restaurant-schema"

type FormMessage = {
  text: string
  type: "error" | "success"
}

const testRestaurantDetails = {
  name: "FoodIO Test Kitchen v1",
  description: "Test restaurant used to verify the FoodIO onboarding process.",
}

const showTestDetails = process.env.NODE_ENV === "development"

export function RestaurantFirstSetupForm() {
  const router = useRouter()
  const [message, setMessage] = useState<FormMessage>()

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    validators: {
      onSubmit: createRestaurantSchema,
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
          restaurant?: {
            id: string
            name: string
            description: string | null
          }
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
        router.replace(data.next ?? `/dashboard`)
        router.refresh()
      } catch {
        setMessage({
          text: "Could not reach the server. Try again.",
          type: "error",
        })
      }
    },
  })

  return (
    <Card className="w-full sm:max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Restaurant Setup</CardTitle>
        <CardDescription>
          Please fill out the form below to Start setting up your restaurant.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate // disable browser validation
          onSubmit={(event) => {
            event.preventDefault() // prevent default form submission
            void form.handleSubmit()
          }}
        >
          <FieldGroup>
            <div className="">
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Restaurant name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={isInvalid}
                        autoComplete="organization"
                        placeholder="Spice House"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              </form.Field>
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                      placeholder="Tell customers what your restaurant is known for."
                    />
                    <FieldDescription>
                      Optional, up to 1,000 characters.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            {message && (
              <Alert
                variant={message.type === "error" ? "destructive" : "default"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  {showTestDetails && (
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={isSubmitting}
                      onClick={() => {
                        form.setFieldValue("name", testRestaurantDetails.name)
                        form.setFieldValue(
                          "description",
                          testRestaurantDetails.description
                        )
                        setMessage(undefined)
                      }}
                    >
                      <FlaskConicalIcon data-icon="inline-start" />
                      Fill test details
                    </Button>
                  )}

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
      </CardContent>
    </Card>
  )
}
