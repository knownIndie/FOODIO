"use client"

import { Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { type CartItemInput, useCart } from "@/components/cart/cart-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AddToCartButton({
  item,
  isLoggedIn,
}: {
  item: CartItemInput
  isLoggedIn: boolean
}) {
  const { items, addItem, replaceCart } = useCart()
  /*
 it is supposed to do the followings
 - add the item to the cart if it is from the first restaurant only
 - if a new item from a new restaurant is added , ask if the user want to replace the cart and make it add the current item only
  */
  const [dialogOpen, setDialogOpen] = useState(false)

  function handleAddToCartButton() {
    const firstItemInCart = items[0]

    if (firstItemInCart && firstItemInCart.restaurantId !== item.restaurantId) {
      setDialogOpen(true)
      return
    }

    addItem(item)
  }

  function handleReplaceCart() {
    replaceCart(item)
    setDialogOpen(false)
  }

  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        nativeButton={false}
        aria-label={`Log in to add ${item.name} to cart`}
        render={<Link href="/login/customer?returnTo=%2Fcustomer" />}
        className="h-10 rounded-full bg-white px-6 font-heading text-sm font-bold text-brand-orange shadow-md ring-1 ring-black/5 hover:bg-brand-orange-soft hover:text-brand-orange"
      >
        ADD
      </Button>
    )
  }

  return (
    <>
      <Button
        variant="ghost"
        aria-label={`Add ${item.name} to cart`}
        onClick={handleAddToCartButton}
        className="h-10 rounded-full bg-white px-6 font-heading text-sm font-bold text-brand-orange shadow-md ring-1 ring-black/5 hover:bg-brand-orange-soft hover:text-brand-orange"
      >
        ADD
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Replace Your Cart ?</DialogTitle>
            <DialogDescription>
              Your cart has dishes from another restaurant. Replacing it will
              remove those dishes and add this one.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Keep my cart
                </Button>
              }
            />
            <DialogClose
              render={
                <Button variant="outline" onClick={handleReplaceCart}>
                  Replace my cart
                </Button>
              }
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Shows how many of this dish are in the cart, with − and + buttons.
export function QuantitySelector({ item }: { item: CartItemInput }) {
  const { items, removeItem, updateQuantity } = useCart()

  // this tells us how many of the item are already in the cart
  const quantity =
    items.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0

  if (quantity === 0) {
    return null
  }

  function handleDecreaseQuantity() {
    if (quantity === 1) {
      removeItem(item.id)
      return
    }
    updateQuantity(item.id, -1)
  }

  return (
    <div className="flex h-9 items-center gap-1 rounded-full border border-border bg-white px-1">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Decrease ${item.name} quantity`}
        onClick={handleDecreaseQuantity}
        className="rounded-full text-brand-orange hover:bg-brand-orange-soft hover:text-brand-orange"
      >
        <Minus />
      </Button>

      <span
        aria-live="polite"
        className="min-w-6 text-center font-heading text-sm font-bold"
      >
        {quantity}
      </span>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Increase ${item.name} quantity`}
        onClick={() => updateQuantity(item.id, 1)}
        className="rounded-full text-brand-orange hover:bg-brand-orange-soft hover:text-brand-orange"
      >
        <Plus />
      </Button>
    </div>
  )
}
