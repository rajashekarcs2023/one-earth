import MapContainer from "@/components/map-container"

export default function MapPage() {
  return (
    <div className="py-6 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">EarthScope 🛰️</h1>
        <p className="text-gray-600">A bird's-eye view of what's happening to your planet</p>
      </div>

      <MapContainer />
    </div>
  )
}
