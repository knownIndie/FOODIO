import SectionHeader from "@/components/restaurants/section/sectionHeader"

export default async function SetupLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ restaurantId: string }>
}>) {
  const { restaurantId } = await params
  return (
    <main className="flex flex-1 flex-col gap-4 px-6">
      <section>
        <SectionHeader restaurantId={restaurantId} />
      </section>
      {/*<section>
        {section}
        {restaurantId}
      </section>*/}
      {children}
    </main>
  )
}
