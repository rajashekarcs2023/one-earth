import { NextResponse } from "next/server"
import type { Comment } from "@/types/report"

// In-memory storage for comments
const comments: Comment[] = [
  {
    id: "1",
    reportId: "1",
    text: "I pass by this area every day. Glad to see it's been cleaned up!",
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    userName: "EcoWatcher",
  },
  {
    id: "2",
    reportId: "3",
    text: "I contacted the local forest department about this. They said they're investigating.",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    userName: "TreeLover",
  },
  {
    id: "3",
    reportId: "4",
    text: "The smell is getting worse. We need immediate action!",
    timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    userName: "RiverGuardian",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reportId = searchParams.get("reportId")

  if (reportId) {
    const filteredComments = comments.filter((comment) => comment.reportId === reportId)
    return NextResponse.json(filteredComments)
  }

  return NextResponse.json(comments)
}

export async function POST(request: Request) {
  const data = await request.json()
  const { reportId, text } = data

  if (!reportId || !text) {
    return NextResponse.json({ success: false, message: "Report ID and text are required" }, { status: 400 })
  }

  const newComment: Comment = {
    id: Date.now().toString(),
    reportId,
    text,
    timestamp: new Date().toISOString(),
    userName: "CurrentUser", // In a real app, this would come from authentication
  }

  comments.push(newComment)

  return NextResponse.json({
    success: true,
    comment: newComment,
  })
}
