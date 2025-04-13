const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Import models
// We need to use dynamic imports since our models are using ES modules
async function importModels() {
  // Create temporary model schemas that match our actual models
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

  const CommentSchema = new mongoose.Schema(
    {
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      userName: { type: String, required: true },
    },
    { timestamps: true }
  );

  const Report = mongoose.model('Report', ReportSchema);
  const Comment = mongoose.model('Comment', CommentSchema);

  return { Report, Comment };
}

const mockReports = [
  {
    image_url: "/roadside-trash.png",
    label: "Illegal dumping near water body",
    severity: 4,
    upvotes: 5,
    location: { lat: 40.7128, lng: -74.006 },
    locationName: "Brooklyn, NYC",
    notifyAuthority: true,
    timestamp: new Date(),
    description: "Large pile of construction waste dumped near the river. It's been here for at least a week.",
    type: "Dumping",
    verifiedBy: "GreenEarth Foundation",
    actionStatus: {
      acted: true,
      status: "Cleaned on April 14 by CityWorks",
    },
  },
  {
    image_url: "/industrial-smokestacks.png",
    label: "Factory emitting excessive smoke",
    severity: 3,
    upvotes: 2,
    location: { lat: 40.72, lng: -74.01 },
    locationName: "Queens, NYC",
    notifyAuthority: false,
    timestamp: new Date(),
    description: "This factory has been releasing dark smoke every morning for the past month.",
    type: "Air Pollution",
  },
  {
    image_url: "/scarred-landscape.png",
    label: "Unauthorized tree cutting in protected area",
    severity: 5,
    upvotes: 8,
    location: { lat: 40.73, lng: -74.02 },
    locationName: "Santa Cruz, CA",
    notifyAuthority: true,
    timestamp: new Date(),
    description: "Several acres of trees have been cut down in this protected forest area.",
    type: "Deforestation",
    verifiedBy: "Forest Protection Agency",
    actionStatus: {
      acted: true,
      status: "In cleanup queue · ETA: 3 days",
    },
  },
  {
    image_url: "/polluted-riverbank.png",
    label: "Chemical discharge into river",
    severity: 4,
    upvotes: 6,
    location: { lat: 40.74, lng: -74.03 },
    locationName: "Manhattan, NYC",
    notifyAuthority: true,
    timestamp: new Date(),
    description: "The water has an unusual color and smell. Fish are dying.",
    type: "Water Pollution",
  },
  {
    image_url: "/industrial-smokestacks.png",
    label: "Excessive air pollution from factory",
    severity: 3,
    upvotes: 4,
    location: { lat: 37.77, lng: -122.41 },
    locationName: "San Francisco, CA",
    notifyAuthority: true,
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    description: "Factory is releasing dark smoke throughout the day, affecting air quality in the neighborhood.",
    type: "Air Pollution",
  },
  {
    image_url: "/roadside-trash.png",
    label: "Illegal waste dumping in park",
    severity: 3,
    upvotes: 3,
    location: { lat: 34.05, lng: -118.24 },
    locationName: "Los Angeles, CA",
    notifyAuthority: false,
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
    description: "Construction waste dumped in the corner of the public park.",
    type: "Dumping",
  },
];

const mockComments = [
  {
    text: "I pass by this area every day. Glad to see it's been cleaned up!",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    userName: "EcoWatcher",
  },
  {
    text: "I contacted the local forest department about this. They said they're investigating.",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    userName: "TreeLover",
  },
  {
    text: "The smell is getting worse. We need immediate action!",
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    userName: "RiverGuardian",
  },
];

async function seedDatabase() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const { Report, Comment } = await importModels();

    // Clear existing data
    console.log('Clearing existing data...');
    await Report.deleteMany({});
    await Comment.deleteMany({});
    console.log('Cleared existing data');

    // Insert reports
    console.log('Inserting reports...');
    const insertedReports = await Report.insertMany(mockReports);
    console.log(`Inserted ${insertedReports.length} reports`);

    // Insert comments with references to reports
    console.log('Inserting comments...');
    const commentsWithReportIds = mockComments.map((comment, index) => ({
      ...comment,
      reportId: insertedReports[index % insertedReports.length]._id,
    }));

    await Comment.insertMany(commentsWithReportIds);
    console.log(`Inserted ${commentsWithReportIds.length} comments`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
