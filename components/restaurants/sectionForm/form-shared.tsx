"use client"

import type { ReactNode } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export type FormMessage = {
  text: string
  type: "error" | "success"
}

export type RestaurantFormProps = {
  restaurantId: string
}

export const showTestDetails = process.env.NODE_ENV === "development"

export const sectionFormContentClassName = "px-5 py-6 sm:px-7 sm:py-7"

export const sectionFormFooterClassName =
  "flex-col items-stretch gap-2 border-t bg-muted/15 px-5 py-6 sm:flex-row sm:items-center sm:justify-end sm:px-7"

export function FormAlert({ message }: { message?: FormMessage }) {
  if (!message) return null

  return (
    <Alert variant={message.type === "error" ? "destructive" : "default"}>
      <AlertDescription>{message.text}</AlertDescription>
    </Alert>
  )
}

export function SectionFormHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <CardHeader className="border-b bg-muted/15 px-5 py-5 sm:px-7">
      <div className="flex items-start gap-3.5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0 pt-0.5">
          <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
          <CardDescription className="mt-1 max-w-2xl text-pretty">
            {description}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  )
}
