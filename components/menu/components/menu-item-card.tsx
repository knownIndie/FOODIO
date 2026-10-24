import { AddToCartButton } from "@/components/cart/components/AddToCartButton"
import { FoodMark } from "@/components/cart/components/food-mark"
import { formatMenuItemOption } from "../entries/menuFormData"

type MenuItemType = {
  id: number
  name: string
  description: string | null
  priceInPaise: number
  isVeg: boolean
  foodTypes: string[]
  cuisines: string[]
  caloriesKcal: number | null
}
type RestaurantType = {
  name: string
  id: string
}
type MenuItemCardProps = {
  item: MenuItemType
  restaurant: RestaurantType
}

const priceFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
})

export function MenuItemCard({ item, restaurant }: MenuItemCardProps) {
  const cuisine = item.cuisines[0] ?? "OTHER"

  return (
    <article className="flex flex-col">
      <div className="relative">
        <div
          aria-hidden="true"
          className="flex aspect-4/3 flex-col items-center justify-center gap-1 rounded-3xl bg-brand-cream px-4 text-center text-brand-cream-foreground"
        >
          <span className="font-heading text-base font-bold">{item.name}</span>
          <span className="text-xs opacity-75">Dish photo</span>
        </div>

        <div className="absolute inset-x-0 -bottom-5 flex justify-center">
          <AddToCartButton
            item={{
              id: item.id,
              restaurantId: restaurant.id,
              restaurantName: restaurant.name,
              name: item.name,
              priceInPaise: item.priceInPaise,
              veg: item.isVeg,
              caloriesKcal: item.caloriesKcal,
              description: item.description,
            }}
          />
        </div>
      </div>

      <div className="mt-8 space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FoodMark veg={item.isVeg} />
          <span>{formatMenuItemOption(cuisine)}</span>
        </div>
        <h3 className="font-heading text-lg leading-tight font-bold">
          {item.name}
        </h3>
        <p className="font-semibold">
          {priceFormatter.format(item.priceInPaise / 100)}
        </p>
        {item.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
    </article>
  )
}
