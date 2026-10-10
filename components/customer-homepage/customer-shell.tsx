"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

type CustomerShellProps = {
  children: ReactNode
  header: ReactNode
  footer: ReactNode
}

export function CustomerShell({
  children,
  header,
  footer,
}: CustomerShellProps) {
  const pathname = usePathname()
  const isCheckout =
    pathname === "/customer/order" || pathname === "/customer/order/review"

  if (isCheckout) {
    return <main>{children}</main>
  }

  return (
    <div className="mx-auto flex min-h-svh flex-col bg-background">
      {header}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      {footer}
    </div>
  )
}
