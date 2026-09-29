"use client"

import { CreditCard, Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCart } from "../cart-provider"

const priceFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "currency",
})

function rupeeFormatter(amountInPaise: number): string {
  // The cart calculates in paise and converts only when displaying money.
  return priceFormatter.format(amountInPaise / 100)
}

export default function ModernCart() {
  // The cart page reads the same items that the menu button changes.
  const { items, updateQuantity, removeItem } = useCart()

  // reduce turns the array of cart items into one subtotal.
  // sum starts at 0 and grows by each item's line total.
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  )

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <div className="space-y-4">
            {items.length === 0 ? (
              <p className="text-muted-foreground">Your cart is empty.</p>
            ) : (
              // map renders one card for each item in the cart.
              items.map((item) => (
                <Card key={item.id} className="overflow-hidden p-0">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium">{item.name}</h3>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.name}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Decrease ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <span className="w-8 text-center">{item.quantity}</span>

                        <Button
                          variant="outline"
                          size="icon"
                          aria-label={`Increase ${item.name} quantity`}
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price per dish multiplied by its quantity. */}
                      <div className="font-medium">
                        {rupeeFormatter(item.priceInPaise * item.quantity)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your cart before checkout.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{rupeeFormatter(subtotal)}</span>
                </div>

                <p className="text-muted-foreground text-sm">
                  Delivery fee calculated at checkout.
                </p>
              </div>

              {/* Checkout is disabled until its flow exists. */}
              <Button className="w-full" disabled>
                <CreditCard className="mr-2 h-4 w-4" />
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
