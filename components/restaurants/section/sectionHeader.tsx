

export default async function SectionHeader({
  restaurantId,
}: {
  restaurantId: string
}) {
  return (
    <div className="flex items-center gap-2">
      <main className="flex items-center justify-around w-full align-middle border border-white/10 p-2 gap-2 rounded-2xl">
        <span>section header</span>
        <span>{}</span>
      </main>
    </div>
  )
}
