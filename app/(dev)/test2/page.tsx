import { AddToCartButton } from "@/components/cart/components/AddToCartButton"
import Cart from "@/components/cart/components/cart"

export default function TestPage2() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex gap-4">
        {/* First click adds a dish from restaurant A. */}
        <AddToCartButton
          item={{
            id: 9001,
            restaurantId: "test-restaurant-a",
            name: "Restaurant A Burger",
            priceInPaise: 15000,
            veg: false,
            caloriesKcal: 400,
            description: "A test burger.",
          }}
        />

        {/* Clicking this after A should open the replacement dialog. */}
        <AddToCartButton
          item={{
            id: 9002,
            restaurantId: "test-restaurant-b",
            name: "Restaurant B Pizza",
            priceInPaise: 25000,
            veg: true,
            caloriesKcal: 550,
            description: "A test pizza.",
          }}
        />
      </div>

      <Cart />
    </div>
  )
}
