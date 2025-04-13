import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema(
  {
    image_url: { type: String, required: true },
    label: { type: String, required: true },
    severity: { type: Number, required: true, min: 1, max: 5 },
    upvotes: { type: Number, default: 0 },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    locationName: { type: String, required: true },
    notifyAuthority: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    description: { type: String },
    type: { type: String, required: true, enum: ['Dumping', 'Deforestation', 'Water Pollution', 'Air Pollution', 'Other'] },
    verifiedBy: { type: String },
    actionStatus: {
      acted: { type: Boolean },
      status: { type: String },
    },
    verifications: [
      {
        timestamp: { type: Date, default: Date.now },
        description: { type: String },
        photoUrl: { type: String, required: true },
        verifiedBy: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Create indexes for common queries
ReportSchema.index({ type: 1 });
ReportSchema.index({ 'location.lat': 1, 'location.lng': 1 });
ReportSchema.index({ timestamp: -1 });

export default mongoose.models.Report || mongoose.model('Report', ReportSchema);
