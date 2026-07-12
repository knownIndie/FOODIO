"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { loginFormSchema } from "@/lib/auth/form-schemas"

const testDetails = {
  email: "foodio.test@example.com",
  password: "FoodIOTest123!",
}

export function LoginForm() {
  const [message, setMessage] = useState<{
    text: string
    type: "error" | "success"
  }>()
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      setMessage(undefined)
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      })
      const data = (await response.json()) as {
        error?: string
        profile?: { name: string; username: string }
      }

      if (!response.ok || !data.profile) {
        setMessage({
          text: data.error ?? "Login failed.",
          type: "error",
        })
        return
      }

      setMessage({
        text: `Logged in as ${data.profile.name} (@${data.profile.username}).`,
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
                  autoComplete="current-password"
                />
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
          >
            {message.text}
          </p>
        )}

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="grid gap-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Logging in..." : "Log in"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => {
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
          Need an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline"
          >
            Sign up
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
