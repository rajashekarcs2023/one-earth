"use client"
import { useState, useEffect } from "react"
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

export default function MapContainer() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Add Leaflet CSS directly to the document head
    const leafletCSS = document.createElement("link")
    leafletCSS.rel = "stylesheet"
    leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    document.head.appendChild(leafletCSS)

    setIsClient(true)

    return () => {
      // Clean up
      document.head.removeChild(leafletCSS)
    }
  }, [])

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return <ReportsMap />
}
