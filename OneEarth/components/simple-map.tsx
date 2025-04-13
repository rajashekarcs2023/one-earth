"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import MapFilters from "./map-filters"
import type { Report } from "@/types/report"

export default function SimpleMap() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch("/api/reports")
      const data = await response.json()
      setReports(data)
      setFilteredReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
      toast({
        title: "Error",
        description: "Failed to load reports. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  useEffect(() => {
    if (activeFilters.length === 0) {
      setFilteredReports(reports)
    } else {
      setFilteredReports(reports.filter((report) => activeFilters.includes(report.type || "Other")))
    }
  }, [activeFilters, reports])

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters)
  }

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "Dumping":
        return "🗑️"
      case "Deforestation":
        return "🌲"
      case "Water Pollution":
        return "🧪"
      case "Air Pollution":
        return "🔥"
      default:
        return "📍"
    }
  }

  const getSeverityColor = (severity: number) => {
    const colors = ["bg-green-500", "bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-500"]
    return colors[severity - 1]
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <MapFilters onFilterChange={handleFilterChange} />

      <div className="h-[calc(100vh-16rem)] w-full rounded-lg overflow-hidden border bg-gray-100 p-4">
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h3 className="text-lg font-medium text-emerald-800 mb-2">Map View Temporarily Simplified</h3>
          <p className="text-gray-600 mb-2">
            We've temporarily simplified the map view to ensure compatibility across all devices. You can still view all
            reports below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-auto h-[calc(100%-80px)]">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className={`bg-white p-3 rounded-lg shadow-sm ${highlightId === report.id ? "ring-2 ring-emerald-500" : ""}`}
            >
              <div className="flex items-start space-x-3">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={report.image_url || "/placeholder.svg"}
                    alt={report.label}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="mr-2">{getTypeIcon(report.type)}</span>
                    <h4 className="font-medium text-sm">{report.label}</h4>
                  </div>

                  <div className="text-xs text-gray-500 mt-1">📍 {report.locationName || "Unknown location"}</div>

                  <div className="flex items-center mt-2">
                    <div className={`${getSeverityColor(report.severity)} w-3 h-3 rounded-full mr-2`}></div>
                    <span className="text-xs">Severity: {report.severity}/5</span>
                    <span className="mx-2">•</span>
                    <span className="text-xs">{report.upvotes} confirmations</span>
                  </div>

                  {report.verifiedBy && (
                    <div className="mt-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-flex items-center">
                      ✅ Verified by {report.verifiedBy}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
