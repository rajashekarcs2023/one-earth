import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Report from '../../../models/Report';
import mongoose from 'mongoose';

export async function POST(request) {
  try {
    await dbConnect();
    const formData = await request.formData();
    const reportId = formData.get('reportId');
    const description = formData.get('description');
    const photo = formData.get('photo');

    if (!reportId || !photo) {
      return NextResponse.json(
        { success: false, message: 'Report ID and photo are required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }

    // In a real app, you would upload the photo to a storage service
    // and get a URL back. For now, we'll use a placeholder URL.
    const photoUrl = '/verification-photo.jpg'; // Replace with actual upload logic

    // Find and update the report
    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        $inc: { upvotes: 1 },
        $push: {
          verifications: {
            timestamp: new Date(),
            description: description || 'Verified in person',
            photoUrl,
            verifiedBy: 'CurrentUser', // In a real app, this would be the user's ID
          },
        },
      },
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
    console.error('Error verifying report:', error);
    return NextResponse.json({ success: false, message: 'Failed to verify report' }, { status: 500 });
  }
}
