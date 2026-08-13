import { Card } from "@/components/ui/card"
import { LeafletLocationPicker } from "@/lib/restaurants/leaflet-location-picker"

export default function TestPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-3 p-4">
      <Card className="p-4">Leaflet location picker</Card>
      <Card className="p-4">
        <LeafletLocationPicker />
      </Card>
    </div>
  )
}
