import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    userName: { type: String, required: true },
  },
  { timestamps: true }
);

// Create index for faster lookup by reportId
CommentSchema.index({ reportId: 1 });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
