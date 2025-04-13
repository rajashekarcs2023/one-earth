import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues with Leaflet
const ReportsMap = dynamic(() => import("@/components/reports-map"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div className="py-6 space-y-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Live Map 🌐</h1>
        <p className="text-gray-600">View and verify environmental issues in your area</p>
      </div>

      <ReportsMap />
    </div>
  )
}
