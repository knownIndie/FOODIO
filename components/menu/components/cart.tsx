"use client"

import {
  CreditCard,
  Minus,
  Package,
  Plus,
  Shield,
  Trash2,
  Truck,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CartItem {
  id: number
  restaurantId: string
  restaurantName: string
  name: string
  priceInPaise: number
  quantity: number
  veg: boolean
  kcals: number | null
  description: string | null
}

interface ShippingMethod {
  id: string
  name: string
  price: number
  estimatedDays: string
  description: string
}

const priceFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: "currency",
})

function rupeeFormatter(amountInPaise: number): string {
  return priceFormatter.format(amountInPaise / 100)
}

export default function ModernCart() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: 1,
      restaurantId: "1",
      restaurantName: "demo-test-restaurant",
      name: "Classic Chronograph Burger",
      priceInPaise: 29999,
      quantity: 1,
      veg: false,
      kcals: 1000,
      description:
        "A juicy, flame-broiled beef patty topped with melted American cheese, crisp lettuce, ripe tomato, and tangy pickles, finished with our signature house sauce on a toasted sesame seed bun.",
    },
  ])

  const [shippingMethod, setShippingMethod] = useState<string>("standard")

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 5999,
      estimatedDays: "3-5 days",
      description: "Free shipping on orders over $200",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 12999,
      estimatedDays: "1-2 days",
      description: "Priority delivery with tracking",
    },
  ]

  const subtotal = items.reduce(
    (sum, item) => sum + item.priceInPaise * item.quantity,
    0
  )
  const shipping =
    shippingMethods.find((m) => m.id === shippingMethod)?.price || 0
  const total = subtotal + shipping

  const updateQuantity = (id: number, change: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="mx-auto w-full max-w-7xl p-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Cart Section */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-semibold">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden p-0">
                <CardContent className="p-0">
                  <div className="flex h-full flex-col md:flex-row">
                    {/* Product Image */}
                    <div className="relative h-auto w-full md:w-32"></div>

                    {/* Product Details */}
                    <div className="flex-1 p-6 pb-3">
                      <div className="flex justify-between">
                        <div className="flex flex-col gap-2 ">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            {item.veg ? "Veg" : "Non-Veg"} • {item.kcals} kcals
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {item.description}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-medium">
                            {rupeeFormatter(item.priceInPaise * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your order details and shipping information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shipping Method */}
              <div className="space-y-2">
                <Label>Shipping Method</Label>
                <Select
                  value={shippingMethod}
                  onValueChange={(value) =>
                    setShippingMethod(value ?? "standard")
                  }
                >
                  <SelectTrigger className="w-full max-w-none data-[size=default]:h-auto">
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent className="!h-auto">
                    {shippingMethods.map((method) => (
                      <SelectItem
                        key={method.id}
                        value={method.id}
                        className="!h-auto"
                      >
                        <div className="flex flex-col justify-between text-start">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-muted-foreground text-sm">
                            {method.estimatedDays}
                          </div>
                          <div className="font-medium">
                            {rupeeFormatter(method.price)}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <Label>Promo Code</Label>
                <div className="flex gap-2">
                  <Input placeholder="Enter promo code" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{rupeeFormatter(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{rupeeFormatter(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{rupeeFormatter(total)}</span>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="text-primary h-4 w-4" />
                  <span>Free returns within 30 days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="text-primary h-4 w-4" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="text-primary h-4 w-4" />
                  <span>Fast delivery</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button className="w-full">
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
