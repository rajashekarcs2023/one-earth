import { NextResponse } from "next/server"
import type { Report } from "@/types/report"

// This would normally be imported from a database
const reports: Report[] = [
  {
    id: "1",
    image_url: "/roadside-trash.png",
    label: "Illegal dumping near water body",
    severity: 4,
    upvotes: 5,
    location: { lat: 40.7128, lng: -74.006 },
    notifyAuthority: true,
    timestamp: new Date().toISOString(),
    description: "Large pile of construction waste dumped near the river. It's been here for at least a week.",
    type: "Dumping",
    verifiedBy: "GreenEarth Foundation",
  },
  // ... other reports
]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const reportId = formData.get("reportId") as string
    const description = formData.get("description") as string
    const photo = formData.get("photo") as File

    if (!reportId) {
      return NextResponse.json({ success: false, message: "Report ID is required" }, { status: 400 })
    }

    if (!photo) {
      return NextResponse.json({ success: false, message: "Verification photo is required" }, { status: 400 })
    }

    // Find the report
    const reportIndex = reports.findIndex((report) => report.id === reportId)

    if (reportIndex === -1) {
      return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 })
    }

    // In a real app, you would store the photo in a storage service
    // and update the database with the verification details

    // For this demo, we'll just increment the upvotes
    reports[reportIndex].upvotes += 1

    // Store the verification details
    if (!reports[reportIndex].verifications) {
      reports[reportIndex].verifications = []
    }

    // Add the verification
    reports[reportIndex].verifications.push({
      timestamp: new Date().toISOString(),
      description: description || "Verified in person",
      // In a real app, this would be the URL to the stored photo
      photoUrl: "/verification-photo.jpg",
      // In a real app, this would be the user's ID or username
      verifiedBy: "CurrentUser",
    })

    return NextResponse.json({
      success: true,
      report: reports[reportIndex],
    })
  } catch (error) {
    console.error("Error processing verification:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
