"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { type ComponentProps, type ReactNode, useId } from "react"
import { cn } from "@/lib/utils"

export function CheckoutPage({
  title,
  backHref,
  backLabel,
  children,
  footer,
}: {
  title: string
  backHref: string
  backLabel: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white font-sans text-sm tracking-tight text-zinc-700">
      <header className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3 sm:px-5">
        <Link
          href={backHref}
          aria-label={backLabel}
          className="flex size-11 shrink-0 items-center justify-center text-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-zinc-900">{title}</h1>
      </header>
      <div className="mx-auto max-w-3xl bg-checkout-background px-3 pt-4 pb-48 sm:px-5 sm:pb-32">
        {children}
      </div>
      {footer}
    </div>
  )
}

export function CheckoutCard({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("mb-4 rounded-2xl bg-white p-4 sm:p-5", className)}
      {...props}
    />
  )
}

export function CheckoutFooter({
  title,
  description,
  label,
  href,
}: {
  title: string
  description: string
  label: string
  href?: string
}) {
  const descriptionId = useId()
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-100 bg-white pb-safe shadow-sm">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div className="min-w-0">
          <h2 className="text-base font-bold sm:text-lg">{title}</h2>
          <p
            id={descriptionId}
            className="mt-1 text-xs leading-relaxed text-zinc-500"
          >
            {description}
          </p>
        </div>
        {href ? (
          <Link
            href={href}
            aria-describedby={descriptionId}
            className="flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-orange px-4 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-brand-orange-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange sm:w-auto sm:min-w-64 sm:shrink-0"
          >
            {label}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            aria-describedby={descriptionId}
            className="min-h-11 w-full rounded-xl bg-zinc-200 px-4 py-3 text-center text-sm font-bold text-zinc-500 sm:w-auto sm:min-w-64 sm:shrink-0"
          >
            {label}
          </button>
        )}
      </div>
    </footer>
  )
}

export function CheckoutEmpty({
  children,
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-2xl bg-white px-4 py-8 text-center", className)}
      {...props}
    >
      {children}
    </section>
  )
}
