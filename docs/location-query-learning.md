# JavaScript for the nearby restaurant query

These are the concepts used to turn database rows into restaurants with their menu items.

## Objects and destructuring

Extract the restaurant ID and collect the remaining fields into a new object:

```ts
const item = { restaurantId: "a", id: 101, name: "Dal" }
const { restaurantId, ...menuItem } = item

// restaurantId: "a"
// menuItem: { id: 101, name: "Dal" }
// item stays unchanged.
```

This is a shallow copy. Nested arrays and objects still share references with the original.

## Arrays, copies, and references

`.push()` changes an existing array. `.slice()` creates a separate array. Its ending index is excluded.

```ts
const names = ["Dal", "Rice", "Dosa"]
const sameArray = names
const preview = names.slice(0, 2)

sameArray.push("Paneer")
preview.push("Roti")

// names: ["Dal", "Rice", "Dosa", "Paneer"]
// preview: ["Dal", "Rice", "Roti"]
```

`const` prevents reassigning the variable. It still allows changing the array's contents. A sliced array also shares references to any objects inside it.

## Loops and map

`for...of` visits one element at a time. `.map()` collects each callback's return value into a new array.

```ts
const restaurants = [
  { id: "a", name: "Delhi Kitchen" },
  { id: "b", name: "Dosa House" },
]

const ids = restaurants.map((restaurant) => restaurant.id)
// ["a", "b"]
```

Reading the IDs does not remove them from the original objects.

## Map and grouping

`Map<string, MenuItem[]>` describes string keys and menu-item-array values. `.get()` reads a value; `.set()` stores one.

```ts
type MenuItem = { id: number; name: string }
const groups = new Map<string, MenuItem[]>()

const availableItems = [
  { restaurantId: "a", id: 101, name: "Dal" },
  { restaurantId: "b", id: 201, name: "Dosa" },
  { restaurantId: "a", id: 102, name: "Rice" },
]

for (const item of availableItems) {
  const { restaurantId, ...menuItem } = item
  const items = groups.get(restaurantId) ?? []
  items.push(menuItem)
  groups.set(restaurantId, items)
}

// "a" → [{ id: 101, name: "Dal" }, { id: 102, name: "Rice" }]
// "b" → [{ id: 201, name: "Dosa" }]
```

For a new key, the fallback creates an array that `.set()` must store. For an existing key, `.get()` returns the stored array itself, so `.push()` updates that array.

## Missing values

`??` supplies a fallback only for `null` or `undefined`. `?.` skips property access or a method call when its receiver is `null` or `undefined`.

```ts
const preview = groups.get("missing")?.slice(0, 6) ?? []
// []
```

Without `?.`, calling `.slice()` on `undefined` throws an error before the fallback can run.

## flatMap and the final result

`.map()` keeps returned arrays nested. `.flatMap()` removes one level of nesting:

```ts
// Callback results: [restaurantA], [], [restaurantB]
// map result:       [[restaurantA], [], [restaurantB]]
// flatMap result:   [restaurantA, restaurantB]
```

Use this to attach items and omit restaurants without available items:

```ts
const result = restaurants.flatMap((restaurant) => {
  const items = groups.get(restaurant.id)?.slice(0, 6) ?? []

  if (items.length === 0) return []

  return [{ ...restaurant, items }]
})
```

Each resulting restaurant has an `items` array. `.slice(0, 6)` keeps at most six items without removing anything from the Map.

## How this fits into queries.ts

1. Find active restaurants with coordinates, within the chosen radius.
2. Sort by calculated distance and select at most 12 restaurants.
3. Extract their IDs with `.map()`.
4. Use `inArray(menuItems.restaurantId, ids)` to fetch their active, available items in one query.
5. Group those items by restaurant ID using a Map.
6. Use `.flatMap()` to build the homepage response.

If some selected restaurants have no items, the final response contains fewer than 12 restaurants.

The distance expression runs in PostgreSQL using the supplied user coordinates and each restaurant's stored coordinates. The earlier formula uses the spherical law of cosines, despite being labelled Haversine. It calculates geographic distance, not road distance.

Your `MenuItemCard` receives a restaurant and a menu item. It supplies `restaurant.id` as the cart item's `restaurantId`, converts `isVeg` to `veg`, and the cart provider adds `quantity: 1`.
