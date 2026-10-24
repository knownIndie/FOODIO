export function FoodMark({ veg }: { veg: boolean }) {
  return (
    <span
      role="img"
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
      className={`mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-sm border-2 border-current ${veg ? "text-veg" : "text-nonveg"}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
    </span>
  )
}
