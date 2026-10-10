const priceFormatter = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  style: "currency",
})

export function formatPrice(paise: number) {
  return priceFormatter.format(paise / 100)
}
