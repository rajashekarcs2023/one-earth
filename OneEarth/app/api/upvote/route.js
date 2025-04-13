import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Report from '../../../models/Report';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();
    const { report_id } = data;

    if (!report_id) {
      return NextResponse.json({ success: false, message: 'Report ID is required' }, { status: 400 });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(report_id)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }

    // Find and update the report
    const report = await Report.findByIdAndUpdate(
      report_id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ success: false, message: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error) {
    console.error('Error upvoting report:', error);
    return NextResponse.json({ success: false, message: 'Failed to upvote report' }, { status: 500 });
  }
}
