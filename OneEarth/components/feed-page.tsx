"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import FeedCard from "./feed-card"
import { Input } from "@/components/ui/input"
import { Search, ThumbsUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Report } from "@/types/report"
import LocationFilter from "./location-filter"
import FeedFilters from "./feed-filters"

export default function FeedPage() {
  // Helper function to get report ID consistently (works with both MongoDB _id and regular id)
  const getReportId = (report: Report): string => {
    return (report._id || report.id) as string
  }
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState<string | null>(null)
  const [followedReports, setFollowedReports] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [communityAssessments, setCommunityAssessments] = useState<Record<string, string>>({})
  const [activeFilters, setActiveFilters] = useState({
    types: [] as string[],
    reporterSeverity: [] as number[],
    communitySeverity: [] as string[],
    status: [] as string[],
  })
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch("/api/reports")
      const data = await response.json()

      // Sort reports by timestamp (newest first)
      const sortedReports = [...data].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setReports(sortedReports)
      setFilteredReports(sortedReports)
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
    // Load followed reports from localStorage
    const savedFollowed = localStorage.getItem("followedReports")
    if (savedFollowed) {
      setFollowedReports(JSON.parse(savedFollowed))
    }

    // Check if onboarding is complete
    const hasOnboarded = localStorage.getItem("hasOnboarded")
    if (hasOnboarded) {
      setOnboardingComplete(true)
    }

    // Load community assessments from localStorage
    const savedAssessments = localStorage.getItem("communityAssessments")
    if (savedAssessments) {
      setCommunityAssessments(JSON.parse(savedAssessments))
    }
  }, [fetchReports])

  // Handle user assessment from Earth Echoes
  const handleUserAssessment = (reportId: string, severity: number) => {
    const severityLabel = getSeverityLabel(severity)
    const newAssessments = { ...communityAssessments, [reportId]: severityLabel }
    setCommunityAssessments(newAssessments)
    localStorage.setItem("communityAssessments", JSON.stringify(newAssessments))
  }

  // Get severity label based on numeric value
  const getSeverityLabel = (severity: number) => {
    if (severity <= 1) return "Minor"
    if (severity <= 2) return "Moderate"
    if (severity <= 3) return "Significant"
    if (severity <= 4) return "Severe"
    return "Critical"
  }

  // Filter reports based on search term, location filter, active tab, and filters
  useEffect(() => {
    let result = [...reports]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (report) =>
          report.label.toLowerCase().includes(term) ||
          (report.description && report.description.toLowerCase().includes(term)) ||
          (report.type && report.type.toLowerCase().includes(term)) ||
          `#${report.type?.replace(/\s+/g, "")}`.toLowerCase().includes(term),
      )
    }

    // Filter by location
    if (locationFilter) {
      result = result.filter((report) => report.locationName && locationFilter ? report.locationName.includes(locationFilter) : false)
    }

    // Filter by tab
    if (activeTab === "following") {
      result = result.filter((report) => followedReports.includes(getReportId(report)))
    }

    // Apply type filters
    if (activeFilters.types.length > 0) {
      result = result.filter((report) => report.type && activeFilters.types.includes(report.type))
    }

    // Apply reporter severity filters
    if (activeFilters.reporterSeverity.length > 0) {
      result = result.filter((report) => activeFilters.reporterSeverity.includes(report.severity))
    }

    // Apply community severity filters
    if (activeFilters.communitySeverity.length > 0) {
      result = result.filter((report) => {
        const assessment = communityAssessments[getReportId(report)]
        return assessment && activeFilters.communitySeverity.includes(assessment)
      })
    }

    // Apply status filters
    if (activeFilters.status.length > 0) {
      result = result.filter((report) => {
        if (activeFilters.status.includes("Verified") && report.verifiedBy) {
          return true
        }
        if (activeFilters.status.includes("Resolved") && report.actionStatus?.acted) {
          return true
        }
        if (activeFilters.status.includes("Pending") && !report.verifiedBy && !report.actionStatus?.acted) {
          return true
        }
        return false
      })
    }

    setFilteredReports(result)
  }, [searchTerm, locationFilter, reports, activeTab, followedReports, activeFilters, communityAssessments])

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
        const updatedReports = reports.map((report) =>
          getReportId(report) === reportId ? { ...report, upvotes: report.upvotes + 1 } : report,
        )
        setReports(updatedReports)

        toast({
          title: "Verification successful",
          description: "Thank you for confirming this issue with photo evidence!",
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

  const handleFollow = (reportId: string) => {
    let newFollowed
    if (followedReports.includes(reportId)) {
      // Unfollow
      newFollowed = followedReports.filter((id) => id !== reportId)
      toast({
        title: "Unfollowed",
        description: "You will no longer receive updates about this issue.",
      })
    } else {
      // Follow
      newFollowed = [...followedReports, reportId]
      toast({
        title: "Following",
        description: "You will receive updates about this environmental issue.",
      })
    }

    setFollowedReports(newFollowed)
    localStorage.setItem("followedReports", JSON.stringify(newFollowed))
  }

  const handleFilterChange = (filters: {
    types: string[]
    reporterSeverity: number[]
    communitySeverity: string[]
    status: string[]
  }) => {
    setActiveFilters(filters)
  }

  // Group similar reports (in a real app, this would be done on the server)
  const groupedReports = filteredReports.reduce((acc, report) => {
    // For this demo, we'll consider reports of the same type within 0.01 degrees as similar
    const similarGroup = acc.find(
      (group) =>
        group[0].type === report.type &&
        Math.abs(group[0].location.lat - report.location.lat) < 0.01 &&
        Math.abs(group[0].location.lng - report.location.lng) < 0.01,
    )

    if (similarGroup) {
      similarGroup.push(report)
    } else {
      acc.push([report])
    }

    return acc
  }, [] as Report[][])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="py-6 space-y-4 relative pb-24">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Planet Pulse 🌍</h1>
        <p className="text-gray-600">Real-time updates from people protecting the Earth</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by issue, description or #hashtag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        <div className="flex justify-between items-center">
          <LocationFilter onLocationChange={setLocationFilter} currentLocation={locationFilter} />
          <FeedFilters onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Trending Reports */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">🔥 Trending Issues</h2>
        <div className="overflow-x-auto pb-2">
          <div className="flex space-x-3">
            {reports
              .filter((report) => report.upvotes > 3)
              .slice(0, 5)
              .map((report) => (
                <div
                  key={getReportId(report)}
                  className="flex-shrink-0 w-40 rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => {
                    const element = document.getElementById(`report-${getReportId(report)}`)
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                      setTimeout(() => {
                        element.classList.add("bg-emerald-50")
                        setTimeout(() => {
                          element.classList.remove("bg-emerald-50")
                        }, 2000)
                      }, 500)
                    }
                  }}
                >
                  <div className="relative h-24">
                    <img
                      src={report.image_url || "/placeholder.svg"}
                      alt={report.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <div className="flex items-center text-white">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        <span className="text-xs">{report.upvotes}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium line-clamp-2">{report.label}</p>
                    <p className="text-xs text-gray-500 mt-1">{report.locationName}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Tabs for All/Following */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="following">Following ({followedReports.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          {groupedReports.length > 0 ? (
            <div className="space-y-4">
              {groupedReports.map((group) => {
                const primaryReport = group[0]
                const isHighlighted = highlightId === getReportId(primaryReport)
                const isFollowed = followedReports.includes(getReportId(primaryReport))

                // If there's only one report in the group, show it normally
                if (group.length === 1) {
                  return (
                    <div
                      id={`report-${getReportId(primaryReport)}`}
                      key={getReportId(primaryReport)}
                      className="transition-colors duration-500"
                    >
                      <FeedCard
                        report={primaryReport}
                        isHighlighted={isHighlighted}
                        isFollowed={isFollowed}
                        onUpvote={handleUpvote}
                        onFollow={handleFollow}
                        onUserAssessment={(severity) => handleUserAssessment(getReportId(primaryReport), severity)}
                      />
                    </div>
                  )
                }

                // If there are multiple reports, show the primary one with a count
                const enhancedReport = {
                  ...primaryReport,
                  description: primaryReport.description
                    ? `${primaryReport.description} (${group.length} people reported this issue)`
                    : `${group.length} people reported this issue`,
                  // Sum up all upvotes from the group
                  upvotes: group.reduce((sum, report) => sum + report.upvotes, 0),
                }

                return (
                  <div
                    id={`report-${getReportId(primaryReport)}`}
                    key={getReportId(primaryReport)}
                    className="transition-colors duration-500"
                  >
                    <FeedCard
                      report={enhancedReport}
                      isHighlighted={isHighlighted}
                      isFollowed={isFollowed}
                      onUpvote={handleUpvote}
                      onFollow={handleFollow}
                      onUserAssessment={(severity) => handleUserAssessment(getReportId(primaryReport), severity)}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No reports match your search criteria.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="following" className="mt-4">
          {filteredReports.length > 0 ? (
            <div className="space-y-4">
              {filteredReports
                .filter((report) => followedReports.includes(getReportId(report)))
                .map((report) => (
                  <div id={`report-${getReportId(report)}`} key={getReportId(report)} className="transition-colors duration-500">
                    <FeedCard
                      report={report}
                      isHighlighted={highlightId === getReportId(report)}
                      isFollowed={true}
                      onUpvote={handleUpvote}
                      onFollow={handleFollow}
                      onUserAssessment={(severity) => handleUserAssessment(getReportId(report), severity)}
                    />
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">You're not following any reports yet.</p>
              <p className="text-gray-500 mt-2">Follow reports to get updates on their status.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Removed the Enhanced Floating Action Button */}
    </div>
  )
}
