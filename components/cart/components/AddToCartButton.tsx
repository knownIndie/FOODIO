"use client"

import { Minus, Plus } from "lucide-react"
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

export function AddToCartButton({ item }: { item: CartItemInput }) {
  const { items, addItem, replaceCart, removeItem, updateQuantity } = useCart()
  /*
 it is supposed to do the followings
 - add the item to the cart if it is from the first restaurant only
 - if a new item from a new restaurant is added , ask if the user want to replace the cart and make it add the current item only
  */
  const [dialogOpen, setDialogOpen] = useState(false)
  // this tells us if the cart has the item already in the cart or not
  const cartItem = items.find((cartItem) => cartItem.id === item.id)

  // this tells us how many of the item are already in the cart
  const quantity = cartItem?.quantity ?? 0

  function handleAddToCartButton() {
    const firstItemInCart = items[0]

    if (firstItemInCart && firstItemInCart.restaurantId !== item.restaurantId) {
      setDialogOpen(true)
      return
    }

    addItem(item)
  }

  function handleDecreaseQuantity() {
    if (quantity === 1) {
      removeItem(item.id)
      return
    }
    updateQuantity(item.id, -1)
  }

  function handleReplaceCart() {
    replaceCart(item)
    setDialogOpen(false)
  }

  return (
    <>
      {quantity === 0 ? (
        <Button
          variant="ghost"
          aria-label={`Add ${item.name} to cart`}
          onClick={handleAddToCartButton}
          className="h-10 rounded-full bg-white px-6 font-heading text-sm font-bold text-brand-orange shadow-md ring-1 ring-black/5 hover:bg-brand-orange-soft hover:text-brand-orange"
        >
          ADD
        </Button>
      ) : (
        <div className="flex h-10 items-center gap-1 rounded-full bg-white px-1 shadow-md ring-1 ring-black/5">
          <Button
            variant="ghost"
            size="icon"
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
            size="icon"
            aria-label={`Increase ${item.name} quantity`}
            onClick={handleAddToCartButton}
            className="rounded-full text-brand-orange hover:bg-brand-orange-soft hover:text-brand-orange"
          >
            <Plus />
          </Button>
        </div>
      )}

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
