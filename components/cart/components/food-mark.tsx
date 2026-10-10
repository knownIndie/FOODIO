export function FoodMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={`mt-1 inline-flex size-4 shrink-0 items-center justify-center rounded-sm border border-current ${veg ? "text-brand-green" : "text-red-700"}`}
    >
      <span className="size-2 rounded-full bg-current" />
    </span>
  )
}
