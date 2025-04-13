import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/mongoose';
import Report from '../../../models/Report';

export async function GET() {
  try {
    await dbConnect();
    const reports = await Report.find({}).sort({ timestamp: -1 });
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    // Validate required fields
    if (!data.image_url || !data.label || !data.severity || !data.location) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new report
    const newReport = await Report.create({
      image_url: data.image_url,
      label: data.label,
      severity: data.severity,
      location: data.location,
      locationName: data.locationName || 'Unknown location',
      notifyAuthority: data.notifyAuthority || false,
      description: data.description || '',
      type: data.type || 'Other',
      verifiedBy: data.verifiedBy,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      report: newReport,
      similarReports: await getSimilarReportsCount(newReport),
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ success: false, message: 'Failed to create report' }, { status: 500 });
  }
}

// Helper function to find similar reports
async function getSimilarReportsCount(report) {
  // Find reports of the same type within 0.01 degrees (roughly 1km)
  const similarReports = await Report.countDocuments({
    _id: { $ne: report._id },
    type: report.type,
    'location.lat': { $gte: report.location.lat - 0.01, $lte: report.location.lat + 0.01 },
    'location.lng': { $gte: report.location.lng - 0.01, $lte: report.location.lng + 0.01 },
  });
  
  return similarReports;
}
