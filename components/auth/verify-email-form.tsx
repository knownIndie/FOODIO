"use client"

import { useForm } from "@tanstack/react-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { emailVerificationCodeSchema } from "@/lib/auth/schema/form-schemas"

type VerifyEmailFormProps = {
  maskedEmail: string
  returnTo: string
}

export function VerifyEmailForm({
  maskedEmail,
  returnTo,
}: VerifyEmailFormProps) {
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "error" | "success"
  }>({
    text: `Enter the code sent to ${maskedEmail}. If Mailtrap has no message, send a new code.`,
    type: "success",
  })

  const form = useForm({
    defaultValues: { code: "" },
    validators: { onSubmit: emailVerificationCodeSchema },
    onSubmit: async ({ value }) => {
      const response = await fetch("/api/auth/email-verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setMessage({
          text: data.error ?? "Email verification failed.",
          type: "error",
        })
        return
      }

      setMessage({ text: "Email verified successfully.", type: "success" })
      router.replace(returnTo)
      router.refresh()
    },
  })

  async function resendCode() {
    setIsResending(true)

    try {
      const response = await fetch("/api/auth/email-verification/send", {
        method: "POST",
      })
      const data = (await response.json()) as { error?: string }

      setMessage(
        response.ok
          ? {
              text: `A new code was sent to ${maskedEmail}.`,
              type: "success",
            }
          : {
              text: data.error ?? "Unable to send a new code.",
              type: "error",
            }
      )
    } finally {
      setIsResending(false)
    }
  }

  async function logout() {
    setIsLoggingOut(true)

    try {
      const response = await fetch("/api/logout", { method: "POST" })

      if (!response.ok) {
        setMessage({ text: "Unable to log out.", type: "error" })
        setIsLoggingOut(false)
        return
      }

      router.replace("/login")
      router.refresh()
    } catch {
      setMessage({ text: "Unable to log out.", type: "error" })
      setIsLoggingOut(false)
    }
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        void form.handleSubmit()
      }}
    >
      <FieldGroup>
        <form.Field name="code">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Verification code</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  aria-invalid={isInvalid}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

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

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <div className="grid gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Verifying..." : "Verify email"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting || isResending}
                onClick={() => void resendCode()}
              >
                {isResending ? "Sending..." : "Send a new code"}
              </Button>
            </div>
          )}
        </form.Subscribe>

        <Button
          type="button"
          variant="ghost"
          disabled={isLoggingOut}
          onClick={() => void logout()}
        >
          {isLoggingOut ? "Logging out..." : "Log out and use another account"}
        </Button>
      </FieldGroup>
    </form>
  )
}
