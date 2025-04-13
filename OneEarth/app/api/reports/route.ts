import { NextResponse } from "next/server"
import type { Report } from "@/types/report"

// In-memory storage for reports
const reports: Report[] = [
  {
    id: "1",
    image_url: "/roadside-trash.png",
    label: "Illegal dumping near water body",
    severity: 4,
    upvotes: 5,
    location: { lat: 40.7128, lng: -74.006 },
    locationName: "Brooklyn, NYC",
    notifyAuthority: true,
    timestamp: new Date().toISOString(),
    description: "Large pile of construction waste dumped near the river. It's been here for at least a week.",
    type: "Dumping",
    verifiedBy: "GreenEarth Foundation",
    actionStatus: {
      acted: true,
      status: "Cleaned on April 14 by CityWorks",
    },
  },
  {
    id: "2",
    image_url: "/industrial-smokestacks.png",
    label: "Factory emitting excessive smoke",
    severity: 3,
    upvotes: 2,
    location: { lat: 40.72, lng: -74.01 },
    locationName: "Queens, NYC",
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
    locationName: "Santa Cruz, CA",
    notifyAuthority: true,
    timestamp: new Date().toISOString(),
    description: "Several acres of trees have been cut down in this protected forest area.",
    type: "Deforestation",
    verifiedBy: "Forest Protection Agency",
    actionStatus: {
      acted: true,
      status: "In cleanup queue · ETA: 3 days",
    },
  },
  {
    id: "4",
    image_url: "/polluted-riverbank.png",
    label: "Chemical discharge into river",
    severity: 4,
    upvotes: 6,
    location: { lat: 40.74, lng: -74.03 },
    locationName: "Manhattan, NYC",
    notifyAuthority: true,
    timestamp: new Date().toISOString(),
    description: "The water has an unusual color and smell. Fish are dying.",
    type: "Water Pollution",
  },
  {
    id: "5",
    image_url: "/industrial-smokestacks.png",
    label: "Excessive air pollution from factory",
    severity: 3,
    upvotes: 4,
    location: { lat: 37.77, lng: -122.41 },
    locationName: "San Francisco, CA",
    notifyAuthority: true,
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    description: "Factory is releasing dark smoke throughout the day, affecting air quality in the neighborhood.",
    type: "Air Pollution",
  },
  {
    id: "6",
    image_url: "/roadside-trash.png",
    label: "Illegal waste dumping in park",
    severity: 3,
    upvotes: 3,
    location: { lat: 34.05, lng: -118.24 },
    locationName: "Los Angeles, CA",
    notifyAuthority: false,
    timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    description: "Construction waste dumped in the corner of the public park.",
    type: "Dumping",
  },
]

export async function GET() {
  return NextResponse.json(reports)
}

export async function POST(request: Request) {
  const data = await request.json()

  // Mock AI label generation based on description or image
  const aiLabels = [
    "Illegal dumping near water body",
    "Factory emitting excessive smoke",
    "Unauthorized tree cutting in protected area",
    "Chemical spill in public area",
    "Air pollution from industrial source",
  ]

  const randomLabel = data.label || aiLabels[Math.floor(Math.random() * aiLabels.length)]
  const reportType = data.type || getReportType(randomLabel)

  // Generate a random location name based on the coordinates
  const locationNames = [
    "Brooklyn, NYC",
    "Manhattan, NYC",
    "Queens, NYC",
    "Santa Cruz, CA",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Miami, FL",
  ]
  const randomLocationName = locationNames[Math.floor(Math.random() * locationNames.length)]

  const newReport: Report = {
    id: Date.now().toString(),
    image_url: data.image_url || "/polluted-riverbank.png",
    label: randomLabel,
    severity: data.severity,
    upvotes: 0,
    location: data.location || { lat: 40.7128, lng: -74.006 },
    locationName: randomLocationName,
    notifyAuthority: data.notifyAuthority,
    timestamp: new Date().toISOString(),
    description: data.description || "",
    type: reportType,
    // Randomly verify some reports for demo purposes
    verifiedBy: Math.random() > 0.7 ? "GreenEarth Foundation" : undefined,
  }

  reports.push(newReport)

  return NextResponse.json({
    success: true,
    report: newReport,
    similarReports: Math.floor(Math.random() * 5), // Mock similar reports count
  })
}

// Helper function to determine report type based on AI label
function getReportType(label: string) {
  const labelLower = label.toLowerCase()
  if (labelLower.includes("dump") || labelLower.includes("waste") || labelLower.includes("trash")) {
    return "Dumping"
  } else if (labelLower.includes("tree") || labelLower.includes("forest") || labelLower.includes("cutting")) {
    return "Deforestation"
  } else if (labelLower.includes("water") || labelLower.includes("river") || labelLower.includes("lake")) {
    return "Water Pollution"
  } else if (labelLower.includes("smoke") || labelLower.includes("air") || labelLower.includes("emission")) {
    return "Air Pollution"
  }
  return "Other"
}
