import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for this project.'],
    maxlength: [60, 'Title cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this project.'],
    maxlength: [1000, 'Description cannot be more than 1000 characters'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    address: String,
    city: String,
    country: String,
  },
  category: {
    type: String,
    required: [true, 'Please specify the category of this project.'],
    enum: ['Reforestation', 'Ocean Cleanup', 'Renewable Energy', 'Waste Management', 'Conservation', 'Other'],
  },
  targetFunding: {
    type: Number,
    required: [true, 'Please specify the target funding amount.'],
  },
  currentFunding: {
    type: Number,
    default: 0,
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify the start date of this project.'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify the end date of this project.'],
  },
  createdBy: {
    type: String,
    required: [true, 'Please specify the creator of this project.'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a geospatial index for location-based queries
ProjectSchema.index({ 'location.coordinates': '2dsphere' });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
