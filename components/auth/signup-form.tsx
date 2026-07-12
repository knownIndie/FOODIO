"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { ChevronDownIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Field,
  FieldDescription,
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
import { signupFormSchema } from "@/lib/auth/form-schemas"

const testDetails = {
  name: "FoodIO Test User",
  username: "foodio_test_user",
  email: "foodio.test@example.com",
  password: "FoodIOTest123!",
}

export function SignupForm() {
  const [message, setMessage] = useState<{
    text: string
    type: "error" | "success"
  }>()
  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      setMessage(undefined)
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      })
      const data = (await response.json()) as {
        error?: string
        profile?: { username: string }
      }

      if (!response.ok || !data.profile) {
        setMessage({
          text: data.error ?? "Registration failed.",
          type: "error",
        })
        return
      }

      setMessage({
        text: `Account @${data.profile.username} created.`,
        type: "success",
      })
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
      <FieldGroup>
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="name"
                  placeholder="Aryan "
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="username">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="username"
                  placeholder="username001"
                />
                <FieldDescription>
                  Use 3 to 30 letters, numbers, or underscores.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  aria-invalid={isInvalid}
                  autoComplete="new-password"
                />
                <FieldDescription>Use at least 8 characters.</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/*<Collapsible className="rounded-2xl border bg-muted/30 p-4">
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-medium">
            Advanced
            <ChevronDownIcon className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <form.Field name="role">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="signup-role">Role</FieldLabel>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) field.handleChange(value)
                      }}
                    >
                      <SelectTrigger
                        id="signup-role"
                        className="w-full"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="RESTAURANT_OWNER">
                          Restaurant owner
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      User is selected by default. Change it if you are creating
                      a restaurant owner account.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </CollapsibleContent>
        </Collapsible>*/}

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
            <div className="grid gap-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating account..." : "Create account"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
                  form.setFieldValue("name", testDetails.name)
                  form.setFieldValue("username", testDetails.username)
                  form.setFieldValue("email", testDetails.email)
                  form.setFieldValue("password", testDetails.password)
                  setMessage(undefined)
                }}
              >
                Fill test details
              </Button>
            </div>
          )}
        </form.Subscribe>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline">
            Log in
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
