import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Comment from '../../../models/Comment';
import mongoose from 'mongoose';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('reportId');

    if (reportId) {
      if (!mongoose.Types.ObjectId.isValid(reportId)) {
        return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
      }

      const comments = await Comment.find({ reportId }).sort({ timestamp: -1 });
      return NextResponse.json(comments);
    }

    const comments = await Comment.find({}).sort({ timestamp: -1 });
    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { reportId, text, userName } = data;

    if (!reportId || !text) {
      return NextResponse.json(
        { success: false, message: 'Report ID and text are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }

    const newComment = await Comment.create({
      reportId,
      text,
      timestamp: new Date(),
      userName: userName || 'Anonymous', // In a real app, this would be the user's ID or username
    });

    return NextResponse.json({
      success: true,
      comment: newComment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ success: false, message: 'Failed to create comment' }, { status: 500 });
  }
}
