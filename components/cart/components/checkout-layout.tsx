import { ArrowLeft, ChevronRight, Lock } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

type CheckoutPageProps = {
  title: string
  backHref: string
  backLabel: string
  children: ReactNode
}

type CheckoutFooterProps = {
  title: string
  description: string
  label: string
  href?: string
}

export function CheckoutPage({
  title,
  backHref,
  backLabel,
  children,
}: CheckoutPageProps) {
  return (
    <div className="min-h-screen bg-page-background font-sans text-sm tracking-tight text-zinc-700">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:gap-4 sm:px-6">
          <Link
            href={backHref}
            aria-label={backLabel}
            className="flex size-11 shrink-0 items-center justify-center rounded-xl text-zinc-700 hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            <ArrowLeft aria-hidden="true" className="size-5" />
          </Link>
          <p className="font-heading text-xl font-black tracking-tight text-zinc-900">
            Food<span className="text-brand-orange">IO</span>
          </p>
          <span aria-hidden="true" className="h-6 w-px bg-zinc-300" />
          <p className="flex items-center gap-1.5 font-heading text-base font-bold text-zinc-700">
            <Lock aria-hidden="true" className="size-4 text-brand-green" />
            Secure checkout
          </p>
        </div>
      </header>
      <h1 className="sr-only">{title}</h1>
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-12 sm:px-6">
        {children}
      </div>
    </div>
  )
}

export function CheckoutFooter({
  title,
  description,
  label,
  href,
}: CheckoutFooterProps) {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white px-4 pt-3 pb-safe shadow-lg lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
      <div className="flex flex-col gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-zinc-900">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-zinc-500">
            {description}
          </p>
        </div>
        {href ? (
          <Link
            href={href}
            className="flex min-h-12 w-full items-center justify-between rounded-xl bg-brand-green px-5 text-base font-bold text-white shadow-sm hover:bg-brand-green-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-orange"
          >
            {label}
            <ChevronRight aria-hidden="true" className="size-5" />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="flex min-h-12 w-full items-center justify-between rounded-xl bg-zinc-200 px-5 text-base font-bold text-zinc-500"
          >
            {label}
          </button>
        )}
      </div>
    </footer>
  )
}
