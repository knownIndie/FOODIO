// Demo delivery flow. When a partner claims an order, a random outcome
// (DELIVERED or CANCELLED) is stored right away, but it is only revealed
// DELIVERY_SIMULATION_MS after the claim. Until then the order is "on the way".
// No background job is needed: the status is worked out from claimedAt on each render.

export const DELIVERY_SIMULATION_MS = 20_000

export type DeliveryStatus =
  | "WAITING_FOR_PARTNER"
  | "ON_THE_WAY"
  | "DELIVERED"
  | "CANCELLED"

type DeliveryFields = {
  claimedAt: Date | null
  deliveryOutcome: "DELIVERED" | "CANCELLED" | null
}

export function revealAt(order: DeliveryFields) {
  return order.claimedAt
    ? new Date(order.claimedAt.getTime() + DELIVERY_SIMULATION_MS)
    : null
}

export function deliveryStatus(
  order: DeliveryFields,
  now = new Date()
): DeliveryStatus {
  const at = revealAt(order)
  if (!at) return "WAITING_FOR_PARTNER"
  if (now < at || !order.deliveryOutcome) return "ON_THE_WAY"
  return order.deliveryOutcome
}

// The next moment any of these orders changes status, so the page can refresh then.
export function nextStatusChange(orders: DeliveryFields[], now = new Date()) {
  let next: Date | null = null
  for (const order of orders) {
    const at = revealAt(order)
    if (at && at > now && (!next || at < next)) next = at
  }
  return next
}
