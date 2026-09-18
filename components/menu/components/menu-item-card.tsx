import { LeafIcon, UtensilsIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatMenuItemOption } from "../entries/menuFormData"
import { AddToCartButton } from "./add-to-cart-button"

type MenuItemType = {
  id: number
  name: string
  description: string | null
  priceInPaise: number
  isVeg: boolean
  foodTypes: string[]
  cuisines: string[]
}
type RestaurantType = {
  name: string
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
  const itemType = item.foodTypes[0] ?? "OTHER"
  const cuisine = item.cuisines[0] ?? "OTHER"

  return (
    <Card className="h-full border-border/70">
      <CardHeader className="gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UtensilsIcon className="size-5" />
          </div>
          <div className="flex flex-col gap-2">
            <Badge variant="outline" className="text-xs">
              {restaurant.name}
            </Badge>
            <Badge
              variant="outline"
              className={
                item.isVeg
                  ? "border-emerald-600/30 text-emerald-700 dark:text-emerald-400"
                  : "border-rose-600/30 text-rose-700 dark:text-rose-400"
              }
            >
              {item.isVeg ? <LeafIcon /> : null}
              {item.isVeg ? "Vegetarian" : "Non-vegetarian"}
            </Badge>
          </div>
        </div>
        <div className="space-y-1.5">
          <CardTitle className="flex items-start justify-between gap-3 text-lg">
            <span>{item.name}</span>
            <span className="shrink-0 text-base font-semibold text-primary">
              {priceFormatter.format(item.priceInPaise / 100)}
            </span>
          </CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="secondary">{formatMenuItemOption(itemType)}</Badge>
          <Badge variant="secondary">{formatMenuItemOption(cuisine)}</Badge>
        </div>
        <AddToCartButton itemId={item.id} />
      </CardContent>
    </Card>
  )
}
