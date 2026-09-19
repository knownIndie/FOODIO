"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCartIcon } from "lucide-react"
import Link from "next/link"

export default function TakeMeToCart() {
  return (
    <Button
      variant="ghost"
      nativeButton={false}
      render={<Link href="/customer/order" />}
      aria-label="Go to cart"
    >
      <ShoppingCartIcon />
    </Button>
  )
}
