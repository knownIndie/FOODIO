"use client"

import { ShoppingCartIcon } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/components/cart/cart-provider"
import { headerLinkClass } from "@/components/extras/classname-extras"

export function CartLink() {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <Link href="/customer/order" className={headerLinkClass}>
      <span className="relative">
        <ShoppingCartIcon className="size-5" aria-hidden="true" />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-green px-1 text-[10px] leading-none font-bold text-white">
            {itemCount}
          </span>
        )}
      </span>
      <span className="sr-only lg:not-sr-only">Cart</span>
    </Link>
  )
}
