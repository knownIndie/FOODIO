export default async function Page({
  params,
}: {
  params: Promise<{ restaurantId: string }>
}) {
  const { restaurantId } = await params
  return <div>My Post: {restaurantId}</div>
}
