"use client"

import { ReactNode, useEffect } from "react"
// ReactNode is a TypeScript type for anything React can render.
// For example: text, JSX, a page, or multiple components.

import { createContext, useState, useContext } from "react"
import { unknown } from "zod/v3"
import { parse } from "zod/v4/core"
// createContext creates a shared place for data.
// useContext reads data from that shared place.
// useState stores data that can change over time.

const CART_STORAGE_KEY = "foodio-cart-v1"

interface CartItem {
  // Shape of one item stored in the cart.
  id: number
  restaurantId: string
  name: string
  priceInPaise: number
  quantity: number
  veg: boolean
  caloriesKcal: number | null
  description: string | null
}

// When adding a new item, quantity is omitted because the provider
// starts each newly added dish at a quantity of 1.
export type CartItemInput = Omit<CartItem, "quantity">
// Omit is a TypeScript utility that creates a type containing
// every CartItem field except quantity.

interface cartContextValue {
  // Describes the value shared by the cart provider. Each field below is available to components that read the context.
  items: CartItem[] // Current cart items, displayed by the cart page.
  addItem: (item: CartItemInput) => void // Adds a dish or increases its quantity.
  replaceCart: (item: CartItemInput) => void // Replaces all cart items with one dish.
  updateQuantity: (id: number, quantity: number) => void // Changes a dish's quantity.
  removeItem: (id: number) => void // Removes a dish from the cart.
}

// The context starts as null because there is no provider value yet.
// Components receive the real value when rendered inside CartProvider.
const cartContext = createContext<cartContextValue | null>(null)

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    // Reject anything that isn't an object.
    // `null` is checked separately because `typeof null === "object"` in JavaScript.
    return false
  }

  // Treat `value` as an object with string keys.
  // The values can be any type, so they remain `unknown` until checked.
  const item = value as Record<string, unknown>

  return (
    /*
    here we are checking that `value` is a valid `CartItem` by making sure all required fields are present and have the correct types.
    */
    typeof item.id === "number" &&
    typeof item.restaurantId === "string" &&
    typeof item.name === "string" &&
    typeof item.priceInPaise === "number" &&
    typeof item.quantity === "number" &&
    item.quantity >= 1 &&
    typeof item.veg === "boolean" &&
    (item.caloriesKcal === null || typeof item.caloriesKcal === "number") &&
    (item.description === null || typeof item.description === "string")
  )
}

export function CartProvider({ children }: { children: ReactNode }) {
  // This wrapper makes the cart state and its operations available
  // to child components, such as the cart page.
  const [items, setItems] = useState<CartItem[]>([])
  // This tells us whether we have finished checking localStorage.
  const [loadedFromStorage, setLoadedFromStorage] = useState(false)

  useEffect(() => {
    // Load cart from localStorage when the component mounts.
    try {
      const savedCart = window.localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedData: unknown = JSON.parse(savedCart)

        if (Array.isArray(parsedData) && parsedData.every(isCartItem)) {
          const restaurantID = parsedData[0].restaurantId
          if (parsedData.every((item) => item.restaurantId === restaurantID)) {
            setItems(parsedData)
          }
        }
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e)
    } finally {
      setLoadedFromStorage(true)
    }
  }, [])

  useEffect(() => {
    if (!loadedFromStorage) {
      return
    }
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error("Failed to save cart to localStorage", e)
    }
  }, [items, loadedFromStorage])

  function addItem(newItem: CartItemInput) {
    // Use the state updater form so the change is based on the latest cart.
    setItems((currentItems) => {
      const firstItem = currentItems[0]
      // If the cart belongs to a different restaurant, leave it unchanged.
      if (firstItem && firstItem.restaurantId !== newItem.restaurantId) {
        return currentItems
      }

      // Find whether this dish is already in the cart.
      const existingItem = currentItems.find(
        (item) => item.restaurantId === newItem.restaurantId
      )

      if (existingItem) {
        // Return a new array and increase the quantity of the matching dish.
        return currentItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // Otherwise append the new dish, starting it at quantity 1.
      return [...currentItems, { ...newItem, quantity: 1 }]
    })
  }

  function replaceCart(newItem: CartItemInput) {
    // Discard the existing cart and store only this item at quantity 1.
    return setItems([{ ...newItem, quantity: 1 }])
  }

  function updateQuantity(id: number, change: number) {
    // Update only the item with this ID. Do not allow quantity below 1.
    return setItems((currentItems) => {
      return currentItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    })
  }

  function removeItem(id: number) {
    // Keep every dish except the one matching this ID.
    return setItems((currentItems) => {
      return currentItems.filter((item) => item.id !== id)
    })
  }

  return (
    <cartContext.Provider
      value={{ items, addItem, replaceCart, updateQuantity, removeItem }}
    >
      {children}
    </cartContext.Provider>
  )
}

export function useCart() {
  const cart = useContext(cartContext)
  if (cart === null) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return cart
}
