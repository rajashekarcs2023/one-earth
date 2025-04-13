"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import FeedCard from "./feed-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Filter, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Report } from "@/types/report"

export default function FeedPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState<string | null>(null)
  const [followedReports, setFollowedReports] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const highlightId = searchParams.get("highlight")
  const router = useRouter()

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
  }, [fetchReports])

  // Filter reports based on search term, location filter, and active tab
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
      result = result.filter((report) => report.locationName?.includes(locationFilter))
    }

    // Filter by tab
    if (activeTab === "following") {
      result = result.filter((report) => followedReports.includes(report.id))
    }

    setFilteredReports(result)
  }, [searchTerm, locationFilter, reports, activeTab, followedReports])

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
          report.id === reportId ? { ...report, upvotes: report.upvotes + 1 } : report,
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

  const locationOptions = [
    { label: "All Locations", value: null },
    { label: "New York City, NY", value: "New York City" },
    { label: "Brooklyn, NY", value: "Brooklyn" },
    { label: "Santa Cruz, CA", value: "Santa Cruz" },
    { label: "California", value: "California" },
    { label: "United States", value: "USA" },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="py-6 space-y-4 relative pb-16">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Activity Feed 📱</h1>
        <p className="text-gray-600">See the latest environmental reports in your area</p>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {locationFilter || "All Locations"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {locationOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value || "all"}
                    onClick={() => setLocationFilter(option.value)}
                    className={locationFilter === option.value ? "bg-emerald-50" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filter Reports</DialogTitle>
                <DialogDescription>Select criteria to filter environmental reports</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Report Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {["All Types", "Dumping", "Deforestation", "Water Pollution", "Air Pollution"].map((type) => (
                      <Button
                        key={type}
                        variant="outline"
                        size="sm"
                        className={type === "All Types" ? "bg-emerald-50" : ""}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Severity</h4>
                  <div className="flex flex-wrap gap-2">
                    {["All", "1+", "2+", "3+", "4+", "5"].map((severity) => (
                      <Button
                        key={severity}
                        variant="outline"
                        size="sm"
                        className={severity === "All" ? "bg-emerald-50" : ""}
                      >
                        {severity}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Status</h4>
                  <div className="flex flex-wrap gap-2">
                    {["All", "Verified", "Resolved", "Pending"].map((status) => (
                      <Button
                        key={status}
                        variant="outline"
                        size="sm"
                        className={status === "All" ? "bg-emerald-50" : ""}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Apply Filters</Button>
              </div>
            </DialogContent>
          </Dialog>
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
                const isHighlighted = highlightId === primaryReport.id
                const isFollowed = followedReports.includes(primaryReport.id)

                // If there's only one report in the group, show it normally
                if (group.length === 1) {
                  return (
                    <FeedCard
                      key={primaryReport.id}
                      report={primaryReport}
                      isHighlighted={isHighlighted}
                      isFollowed={isFollowed}
                      onUpvote={handleUpvote}
                      onFollow={handleFollow}
                    />
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
                  <FeedCard
                    key={primaryReport.id}
                    report={enhancedReport}
                    isHighlighted={isHighlighted}
                    isFollowed={isFollowed}
                    onUpvote={handleUpvote}
                    onFollow={handleFollow}
                  />
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
                .filter((report) => followedReports.includes(report.id))
                .map((report) => (
                  <FeedCard
                    key={report.id}
                    report={report}
                    isHighlighted={highlightId === report.id}
                    isFollowed={true}
                    onUpvote={handleUpvote}
                    onFollow={handleFollow}
                  />
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

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-lg bg-emerald-600 hover:bg-emerald-700"
        onClick={() => router.push("/")}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
