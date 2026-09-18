"use client"

import { Button } from "@/components/ui/button"
import { addToCart } from "@/lib/cart/add-to-cart"

export function AddToCartButton({ itemId }: { itemId: number }) {
  return (
    <Button variant="secondary" onClick={() => addToCart(itemId)}>
      add to cart
    </Button>
  )
}
