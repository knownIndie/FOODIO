import z from "zod"

const CHECKOUT_ID_STORAGE_KEY = "foodio-checkout-key"
class CheckoutKeyCreationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "checkoutkeyCreationError"
  }
}

export function clearCheckoutId() {
  window.sessionStorage.removeItem(CHECKOUT_ID_STORAGE_KEY)
}

export function getOrCreateCheckoutId() {
  const data = window.sessionStorage.getItem(CHECKOUT_ID_STORAGE_KEY)

  if (data !== null) {
    const result = z.uuid().safeParse(data)
    if (!result.success) {
      throw new CheckoutKeyCreationError(
        "the key stored is invalid or unavailable"
      )
    }
    return result.data
  }
  const checkoutId = window.crypto.randomUUID() // built-in JavaScript function that generates a random, unique identifier (UUID)
  window.sessionStorage.setItem(CHECKOUT_ID_STORAGE_KEY, checkoutId)
  return checkoutId
}
