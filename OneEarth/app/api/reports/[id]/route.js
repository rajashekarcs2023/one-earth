import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose';
import Report from '../../../../models/Report';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }
    
    const report = await Report.findById(id);
    
    if (!report) {
      return NextResponse.json({ success: false, message: 'Report not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }
    
    await dbConnect();
    
    const updatedReport = await Report.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedReport) {
      return NextResponse.json({ success: false, message: 'Report not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updatedReport });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid report ID' }, { status: 400 });
    }
    
    const deletedReport = await Report.findByIdAndDelete(id);
    
    if (!deletedReport) {
      return NextResponse.json({ success: false, message: 'Report not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
