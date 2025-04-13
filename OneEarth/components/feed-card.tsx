"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Share2, MapPin, MessageCircle, Bell, CheckCircle2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Report } from "@/types/report"
import EarthEchoes from "./earth-echoes"
import VerificationFlow from "./verification-flow"

interface FeedCardProps {
  report: Report
  isHighlighted?: boolean
  isFollowed?: boolean
  onUpvote: (reportId: string) => Promise<void>
  onFollow: (reportId: string) => void
  onUserAssessment?: (severity: number) => void
}

export default function FeedCard({
  report,
  isHighlighted,
  isFollowed,
  onUpvote,
  onFollow,
  onUserAssessment,
}: FeedCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [showVerificationFlow, setShowVerificationFlow] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [comment, setComment] = useState("")
  const [showSeverityTooltip, setShowSeverityTooltip] = useState(false)
  const { toast } = useToast()

  // Mock follower count - in a real app, this would come from the backend
  const followerCount = Math.floor(Math.random() * 30) + 1

  const handleUpvoteClick = () => {
    setShowVerificationFlow(true)
  }

  const handleVerificationSubmit = async (reportId: string, description: string, photoBlob: Blob) => {
    try {
      // In a real app, you would upload the photo and description to your server
      // For this demo, we'll just simulate a successful verification

      // Create a FormData object to send the photo and description
      const formData = new FormData()
      formData.append("photo", photoBlob)
      formData.append("description", description)
      formData.append("reportId", reportId)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Call the onUpvote function to update the UI
      await onUpvote(reportId)
    } catch (error) {
      console.error("Error submitting verification:", error)
      throw error
    }
  }

  const handleShare = () => {
    toast({
      title: "Sharing report",
      description: "This would open a share dialog in a real app.",
    })
  }

  const handleCommentClick = () => {
    setShowCommentInput(!showCommentInput)
  }

  const handleFollowClick = () => {
    onFollow(report.id)
  }

  const handleUserAssessment = (severity: number) => {
    if (onUserAssessment) {
      onUserAssessment(severity)
    }
  }

  const submitComment = () => {
    if (comment.trim()) {
      toast({
        title: "Comment added",
        description: "Your comment has been added to this report.",
      })
      // In a real app, we would send this to the server
      setComment("")
      setShowCommentInput(false)
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const reportTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - reportTime.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    }
  }

  // Generate hashtags based on report type and content
  const getHashtags = () => {
    const tags = [`#${report.type?.replace(/\s+/g, "")}`]

    if (report.label.toLowerCase().includes("water")) {
      tags.push("#WaterProtection")
    }
    if (report.label.toLowerCase().includes("illegal")) {
      tags.push("#IllegalActivity")
    }
    if (report.severity >= 4) {
      tags.push("#HighPriority")
    }

    return tags
  }

  // Check if report has been acted on
  const getActionStatus = () => {
    // Mock data - in a real app, this would come from the backend
    if (report.id === "1" || report.verifiedBy) {
      return {
        acted: true,
        status: "Cleaned on April 14 by CityWorks",
      }
    } else if (report.id === "3") {
      return {
        acted: true,
        status: "In cleanup queue · ETA: 3 days",
      }
    }
    return null
  }

  // Get severity color based on level
  const getSeverityColor = (severity: number) => {
    if (severity <= 1) return "bg-green-500 text-white"
    if (severity <= 2) return "bg-green-500 text-white"
    if (severity <= 3) return "bg-yellow-500 text-white"
    if (severity <= 4) return "bg-orange-500 text-white"
    return "bg-red-500 text-white"
  }

  // Get severity label
  const getSeverityLabel = (severity: number) => {
    if (severity <= 1) return "Minor"
    if (severity <= 2) return "Moderate"
    if (severity <= 3) return "Significant"
    if (severity <= 4) return "Severe"
    return "Critical"
  }

  const actionStatus = getActionStatus()
  const hashtags = getHashtags()

  return (
    <>
      <Card className={`mb-4 overflow-hidden relative ${isHighlighted ? "ring-2 ring-emerald-500 shadow-lg" : ""}`}>
        <div className="relative">
          <img src={report.image_url || "/placeholder.svg"} alt={report.label} className="w-full h-48 object-cover" />

          {/* Timestamp */}
          <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            {formatTimeAgo(report.timestamp)}
          </div>

          {/* Verification badge */}
          {report.verifiedBy && (
            <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
              <span className="mr-1">✅</span> Verified by {report.verifiedBy}
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Title and severity */}
            <div className="flex items-start">
              <div className="flex items-center flex-1 mr-2">
                <span className="mr-2 text-xl">{getTypeIcon(report.type)}</span>
                <h3 className="font-medium text-lg">{report.label}</h3>
              </div>
              <div className="relative">
                <div
                  className={`${getSeverityColor(
                    report.severity,
                  )} px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap`}
                  onMouseEnter={() => setShowSeverityTooltip(true)}
                  onMouseLeave={() => setShowSeverityTooltip(false)}
                >
                  Severity {report.severity}
                </div>
                {showSeverityTooltip && (
                  <div className="absolute right-0 bottom-full mb-2 w-48 bg-white p-2 rounded-md shadow-lg border z-50">
                    <p className="text-xs font-medium">Reporter's Assessment</p>
                    <p className="text-xs mt-1">
                      This is the severity level assessed by the person who reported this issue.
                    </p>
                    <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
              {report.locationName || "Brooklyn, NYC"}
            </div>

            {/* Description */}
            {report.description && <p className="text-gray-700 italic">"{report.description}"</p>}

            {/* Earth Echoes Component */}
            <EarthEchoes
              reportId={report.id}
              initialSeverity={report.severity}
              onUserAssessment={handleUserAssessment}
            />

            {/* Hashtags */}
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, index) => (
                <button
                  key={index}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
                  onClick={() => {
                    toast({
                      title: `Searching for ${tag}`,
                      description: "This would filter reports by this tag in a real app.",
                    })
                  }}
                >
                  🏷️ {tag}
                </button>
              ))}
            </div>

            {/* Action status */}
            {actionStatus && (
              <div className="bg-green-50 text-green-800 p-2 rounded-md flex items-center text-sm">
                {actionStatus.status.includes("Cleaned") ? (
                  <span className="mr-1">✅</span>
                ) : (
                  <span className="mr-1">🛠️</span>
                )}
                {actionStatus.status}
              </div>
            )}

            <hr className="my-2" />

            {/* Action buttons */}
            <div className="flex items-center">
              <div className="flex items-center text-gray-500 mr-4">
                <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />
                <span className="text-sm">
                  <strong>{report.upvotes}</strong> verifications
                </span>
              </div>

              <div className="ml-auto flex space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  onClick={handleUpvoteClick}
                  disabled={isUpvoting}
                  title="Verify in person"
                >
                  <CheckCircle2 className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  onClick={handleCommentClick}
                  title="Comment"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>

                <div className="relative">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`h-9 w-9 rounded-full ${isFollowed ? "text-emerald-600" : ""}`}
                    onClick={handleFollowClick}
                    title={isFollowed ? "Unfollow" : "Follow for updates"}
                  >
                    {isFollowed ? (
                      <div className="relative">
                        <Bell className="h-4 w-4 fill-emerald-600" />
                        <span className="absolute -top-1 -right-1 bg-emerald-600 rounded-full w-2 h-2"></span>
                      </div>
                    ) : (
                      <Bell className="h-4 w-4" />
                    )}
                  </Button>
                  {followerCount > 0 && (
                    <div className="absolute -bottom-1 -right-1 bg-gray-100 rounded-full px-1 text-xs text-gray-700 flex items-center">
                      <Users className="h-2 w-2 mr-0.5" />
                      {followerCount}
                    </div>
                  )}
                </div>

                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full"
                  onClick={handleShare}
                  title="Share"
                >
                  <Share2 className="h-4 w-4" />
                </Button>

                <Link href={`/map?highlight=${report.id}`}>
                  <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" title="View on map">
                    <MapPin className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Comment input */}
            {showCommentInput && (
              <div className="mt-2 space-y-2">
                <textarea
                  className="w-full p-2 border rounded-md text-sm"
                  placeholder="Add your comment..."
                  rows={2}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setShowCommentInput(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button size="sm" onClick={submitComment} className="text-xs bg-emerald-600 hover:bg-emerald-700">
                    Post
                  </Button>
                </div>
              </div>
            )}

            {/* Authority notification */}
            {report.notifyAuthority && (
              <div className="text-xs bg-yellow-50 text-yellow-800 p-2 rounded-md flex items-center mt-2">
                🚨 Report forwarded to local authorities
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Verification Flow Modal */}
      {showVerificationFlow && (
        <VerificationFlow
          report={report}
          onClose={() => setShowVerificationFlow(false)}
          onVerify={handleVerificationSubmit}
        />
      )}
    </>
  )
}
