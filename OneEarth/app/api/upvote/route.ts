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
  {
    id: "2",
    image_url: "/industrial-smokestacks.png",
    label: "Factory emitting excessive smoke",
    severity: 3,
    upvotes: 2,
    location: { lat: 40.72, lng: -74.01 },
    notifyAuthority: false,
    timestamp: new Date().toISOString(),
    description: "This factory has been releasing dark smoke every morning for the past month.",
    type: "Air Pollution",
  },
  {
    id: "3",
    image_url: "/scarred-landscape.png",
    label: "Unauthorized tree cutting in protected area",
    severity: 5,
    upvotes: 8,
    location: { lat: 40.73, lng: -74.02 },
    notifyAuthority: true,
    timestamp: new Date().toISOString(),
    description: "Several acres of trees have been cut down in this protected forest area.",
    type: "Deforestation",
    verifiedBy: "Forest Protection Agency",
  },
  {
    id: "4",
    image_url: "/polluted-riverbank.png",
    label: "Chemical discharge into river",
    severity: 4,
    upvotes: 6,
    location: { lat: 40.74, lng: -74.03 },
    notifyAuthority: true,
    timestamp: new Date().toISOString(),
    description: "The water has an unusual color and smell. Fish are dying.",
    type: "Water Pollution",
  },
]

export async function POST(request: Request) {
  const data = await request.json()
  const { report_id } = data

  const reportIndex = reports.findIndex((report) => report.id === report_id)

  if (reportIndex === -1) {
    return NextResponse.json({ success: false, message: "Report not found" }, { status: 404 })
  }

  reports[reportIndex].upvotes += 1

  return NextResponse.json({
    success: true,
    report: reports[reportIndex],
  })
}
