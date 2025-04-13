"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import type { Report } from "@/types/report"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"
import L from "leaflet"
import MapFilters from "./map-filters"

// Create custom emoji icons for different report types
const createEmojiIcon = (emoji: string) => {
  return L.divIcon({
    html: `<div style="font-size: 24px; display: flex; align-items: center; justify-content: center;">${emoji}</div>`,
    className: "emoji-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  })
}

// Define icons for each report type
const reportTypeIcons = {
  Dumping: createEmojiIcon("🗑️"),
  Deforestation: createEmojiIcon("🌲"),
  "Water Pollution": createEmojiIcon("🧪"),
  "Air Pollution": createEmojiIcon("🔥"),
  Other: createEmojiIcon("📍"),
}

// Add a component to handle map interactions
function MapController({ reports, highlightId }: { reports: Report[]; highlightId?: string }) {
  const map = useMap()

  useEffect(() => {
    if (highlightId) {
      const report = reports.find((r) => r.id === highlightId)
      if (report) {
        map.setView([report.location.lat, report.location.lng], 16, {
          animate: true,
          duration: 1,
        })
      }
    }
  }, [highlightId, reports, map])

  return null
}

// Update the ReportsMap component
export default function ReportsMap() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")
  const mapRef = useRef<L.Map | null>(null)

  // Add custom CSS for the emoji markers
  useEffect(() => {
    const style = document.createElement("style")
    style.textContent = `
      .emoji-marker {
        background: none;
        border: none;
        text-shadow: 0px 0px 3px white, 0px 0px 5px white;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

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

  const handleUpvote = async (reportId: string) => {
    try {
      const response = await fetch("/api/upvote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ report_id: reportId }),
      })

      const data = await response.json()

      if (data.success) {
        // Update the reports state with the updated report
        setReports(
          reports.map((report) => (report.id === reportId ? { ...report, upvotes: report.upvotes + 1 } : report)),
        )

        toast({
          title: "Upvoted",
          description: "Thank you for confirming this issue!",
        })
      } else {
        throw new Error("Failed to upvote report")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upvote report. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleShare = (report: Report) => {
    // Mock share functionality
    toast({
      title: "Sharing report",
      description: "This would open a share dialog in a real app.",
    })
  }

  const getSeverityColor = (severity: number) => {
    const colors = ["bg-green-500", "bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-500"]
    return colors[severity - 1]
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

  // Get the appropriate icon for a report
  const getMarkerIcon = (report: Report) => {
    const type = report.type || "Other"
    return reportTypeIcons[type] || reportTypeIcons["Other"]
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

      <div className="h-[calc(100vh-16rem)] w-full rounded-lg overflow-hidden border">
        <MapContainer
          center={[40.7128, -74.006]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          attributionControl={false}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapController reports={reports} highlightId={highlightId || undefined} />

          {filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={getMarkerIcon(report)}
              title={`${getTypeIcon(report.type)} ${report.label}`}
            >
              <Popup className="leaflet-popup-content-wrapper">
                <div className="w-64 p-1">
                  <img
                    src={report.image_url || "/placeholder.svg"}
                    alt={report.label}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />

                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="text-sm font-medium flex-1">
                        <span className="mr-1">{getTypeIcon(report.type)}</span>
                        {report.label}

                        {report.verifiedBy && (
                          <div className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full ml-1">
                            ✅ Verified by {report.verifiedBy}
                          </div>
                        )}
                      </div>
                    </div>

                    {report.description && <div className="text-xs text-gray-600 italic">"{report.description}"</div>}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`${getSeverityColor(report.severity)} w-3 h-3 rounded-full mr-2`}></div>
                        <span className="text-xs">Severity: {report.severity}/5</span>
                      </div>

                      <div className="text-xs text-gray-500">{new Date(report.timestamp).toLocaleDateString()}</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <span className="font-medium">{report.upvotes}</span>
                        <span className="text-gray-500 text-xs ml-1">people confirmed this</span>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs"
                          onClick={() => handleUpvote(report.id)}
                        >
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          I've seen this
                        </Button>

                        <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => handleShare(report)}>
                          <Share2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
