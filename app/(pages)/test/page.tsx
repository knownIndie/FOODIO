import { MenuForm } from "@/components/menu/menu-form"
import { Card } from "@/components/ui/card"

export default function TestPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 p-4">
      <Card className="p-4">
        Menu form preview. Saving requires opening your own restaurant.
      </Card>
      <MenuForm />
    </div>
  )
}
