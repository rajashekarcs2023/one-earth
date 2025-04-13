"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ThumbsUp, Clock, CheckCircle, Award, Leaf } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Report } from "@/types/report"

export default function MyEarthPage() {
  const [userReports, setUserReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  // Mock user stats
  const userStats = {
    totalReports: 0,
    resolvedIssues: 0,
    confirmationsReceived: 0,
    impactScore: 0,
    level: 1,
  }

  useEffect(() => {
    const fetchUserReports = async () => {
      try {
        // In a real app, this would fetch only the current user's reports
        const response = await fetch("/api/reports")
        const allReports = await response.json()

        // Simulate user's reports (random selection for demo)
        const userIds = ["1", "3", "5"] // Pretend these are the user's reports
        const myReports = allReports.filter((report: Report) => userIds.includes(report.id))

        setUserReports(myReports)

        // Update user stats
        userStats.totalReports = myReports.length
        userStats.resolvedIssues = myReports.filter((r) => r.actionStatus?.acted).length
        userStats.confirmationsReceived = myReports.reduce((sum, r) => sum + r.upvotes, 0)
        userStats.impactScore = userStats.resolvedIssues * 10 + userStats.confirmationsReceived * 2
        userStats.level = Math.floor(userStats.impactScore / 20) + 1
      } catch (error) {
        console.error("Error fetching user reports:", error)
        toast({
          title: "Error",
          description: "Failed to load your reports. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserReports()
  }, [toast])

  const getStatusBadge = (report: Report) => {
    if (report.actionStatus?.acted) {
      return report.actionStatus.status.includes("Cleaned") ? (
        <Badge className="bg-green-500">Cleaned</Badge>
      ) : (
        <Badge className="bg-blue-500">In Progress</Badge>
      )
    } else if (report.verifiedBy) {
      return <Badge className="bg-purple-500">Verified</Badge>
    } else if (report.upvotes > 3) {
      return <Badge className="bg-yellow-500">Confirmed</Badge>
    } else {
      return <Badge className="bg-gray-500">Pending</Badge>
    }
  }

  const getStatusIcon = (report: Report) => {
    if (report.actionStatus?.acted) {
      return report.actionStatus.status.includes("Cleaned") ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <Clock className="h-5 w-5 text-blue-500" />
      )
    } else if (report.verifiedBy) {
      return <CheckCircle className="h-5 w-5 text-purple-500" />
    } else if (report.upvotes > 3) {
      return <ThumbsUp className="h-5 w-5 text-yellow-500" />
    } else {
      return <Clock className="h-5 w-5 text-gray-500" />
    }
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

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Your Earth, Your Impact 🌎</h1>
        <p className="text-gray-600">Track your contributions to a healthier planet</p>
      </div>

      {/* Impact Summary Card */}
      <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-emerald-600 mr-2" />
              <h2 className="text-lg font-semibold text-emerald-800">Impact Summary</h2>
            </div>
            <Badge className="bg-emerald-600">Level {userStats.level}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-500">Reports Submitted</div>
              <div className="text-2xl font-bold text-emerald-700">{userStats.totalReports}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-500">Issues Resolved</div>
              <div className="text-2xl font-bold text-emerald-700">{userStats.resolvedIssues}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-500">Confirmations</div>
              <div className="text-2xl font-bold text-emerald-700">{userStats.confirmationsReceived}</div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-sm text-gray-500">Impact Score</div>
              <div className="text-2xl font-bold text-emerald-700">{userStats.impactScore}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userStats.level + 1}</span>
              <span>{userStats.impactScore % 20}/20 points</span>
            </div>
            <Progress value={(userStats.impactScore % 20) * 5} className="h-2" />
          </div>

          {/* Visual Impact Representation */}
          <div className="mt-4 flex justify-center">
            {Array.from({ length: Math.min(userStats.level, 5) }).map((_, i) => (
              <Leaf key={i} className="h-6 w-6 text-emerald-500 mx-1" />
            ))}
            {Array.from({ length: Math.max(5 - userStats.level, 0) }).map((_, i) => (
              <Leaf key={i + 5} className="h-6 w-6 text-gray-300 mx-1" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports Tabs */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-800 mb-3">Your Reports</h2>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            {renderReportsList(userReports)}
          </TabsContent>

          <TabsContent value="pending" className="mt-4">
            {renderReportsList(userReports.filter((r) => !r.verifiedBy && r.upvotes <= 3 && !r.actionStatus?.acted))}
          </TabsContent>

          <TabsContent value="confirmed" className="mt-4">
            {renderReportsList(userReports.filter((r) => r.verifiedBy || r.upvotes > 3))}
          </TabsContent>

          <TabsContent value="resolved" className="mt-4">
            {renderReportsList(userReports.filter((r) => r.actionStatus?.acted))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  function renderReportsList(reports: Report[]) {
    if (reports.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No reports yet</h3>
          <p className="text-gray-500 mb-4">Start reporting environmental issues to see your impact grow!</p>
          <Link href="/" className="text-emerald-600 font-medium hover:underline">
            Create your first report →
          </Link>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id} className="overflow-hidden">
            <div className="flex">
              <div className="w-1/3">
                <img
                  src={report.image_url || "/placeholder.svg"}
                  alt={report.label}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardContent className="w-2/3 p-3">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center">
                    <span className="mr-1 text-lg">{getTypeIcon(report.type)}</span>
                    <h3 className="font-medium text-sm line-clamp-1">{report.label}</h3>
                  </div>
                  {getStatusBadge(report)}
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {formatDate(report.timestamp)} • {report.locationName}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-gray-600">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    <span>{report.upvotes} confirmations</span>
                  </div>
                  <div className="flex items-center">{getStatusIcon(report)}</div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    )
  }
}
