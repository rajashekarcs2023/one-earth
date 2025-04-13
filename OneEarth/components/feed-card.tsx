"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Share2, MapPin, MessageCircle, Camera, Bell, BellOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Report } from "@/types/report"

interface FeedCardProps {
  report: Report
  isHighlighted?: boolean
  isFollowed?: boolean
  onUpvote: (reportId: string) => Promise<void>
  onFollow: (reportId: string) => void
}

export default function FeedCard({ report, isHighlighted, isFollowed, onUpvote, onFollow }: FeedCardProps) {
  const [isUpvoting, setIsUpvoting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [comment, setComment] = useState("")
  const { toast } = useToast()

  const handleUpvoteClick = () => {
    setIsVerifying(true)
    // Mock location verification
    toast({
      title: "Location verification required",
      description: (
        <div className="space-y-2">
          <p>Please allow location access to verify you are within 250m of this issue.</p>
          <div className="flex space-x-2 mt-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsVerifying(false)
                toast({
                  title: "Verification cancelled",
                  description: "You can try again when you're near the location.",
                })
              }}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              onClick={() => {
                setIsVerifying(false)
                toast({
                  title: "Upload verification photo",
                  description: (
                    <div className="space-y-2">
                      <p>Please take a photo of the issue to confirm your report.</p>
                      <Button
                        size="sm"
                        className="w-full mt-2 flex items-center justify-center"
                        onClick={() => {
                          // Mock photo verification
                          toast({
                            title: "Verifying photo...",
                            description: "Analyzing your image...",
                          })

                          // Simulate AI verification delay
                          setTimeout(async () => {
                            try {
                              await onUpvote(report.id)
                            } catch (error) {
                              console.error("Error upvoting:", error)
                            }
                          }, 2000)
                        }}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  ),
                  duration: 10000,
                })
              }}
            >
              Allow Location
            </Button>
          </div>
        </div>
      ),
      duration: 10000,
    })
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

  const actionStatus = getActionStatus()
  const hashtags = getHashtags()

  return (
    <Card className={`mb-4 overflow-hidden ${isHighlighted ? "ring-2 ring-emerald-500 shadow-lg" : ""}`}>
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
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <span className="mr-2 text-xl">{getTypeIcon(report.type)}</span>
              <h3 className="font-medium text-lg">{report.label}</h3>
            </div>
            <div className={`bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-medium`}>
              Severity {report.severity}
            </div>
          </div>

          {/* Location */}
          <div className="text-sm text-gray-600 flex items-center">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {report.locationName || "Brooklyn, NYC"}
          </div>

          {/* Description */}
          {report.description && <p className="text-gray-700 italic">"{report.description}"</p>}

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
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span className="text-sm">
                <strong>{report.upvotes}</strong> confirmations
              </span>
            </div>

            <div className="ml-auto flex space-x-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 rounded-full"
                onClick={handleUpvoteClick}
                disabled={isUpvoting || isVerifying}
                title="I've seen this"
              >
                <ThumbsUp className="h-4 w-4" />
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

              <Button
                size="icon"
                variant={isFollowed ? "default" : "ghost"}
                className={`h-9 w-9 rounded-full ${isFollowed ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                onClick={handleFollowClick}
                title={isFollowed ? "Unfollow" : "Follow for updates"}
              >
                {isFollowed ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>

              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full" onClick={handleShare} title="Share">
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
  )
}
