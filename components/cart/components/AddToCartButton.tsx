"use client"
import { CartItemInput, useCart } from "@/components/cart/cart-provider"
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
import { useState } from "react"

export function AddToCartButton({ item }: { item: CartItemInput }) {
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

  return (
    <>
      <Button variant="secondary" onClick={handleAddToCartButton}>
        {" "}
        Add To Cart
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
