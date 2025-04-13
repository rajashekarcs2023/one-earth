# one-earth


## 🌍 Environmental Monitoring & Reporting Platform

BirthSafe Dashboard is a comprehensive environmental monitoring and reporting platform that empowers citizens to document, report, and track environmental issues in their communities. Leveraging AI-powered analysis and community engagement features, the platform helps transform environmental awareness into actionable insights.



## ✨ Features

### 📱 User-Friendly Reporting

- Intuitive mobile-first interface for easy reporting
- AI-powered image analysis for automatic issue classification
- Location-based reporting with environmental context enhancement
- Severity assessment with scientific criteria


### 🗺️ Interactive Map View

- Geospatial visualization of environmental issues
- Filtering by issue type, severity, and status
- Cluster visualization for high-density areas
- Location-based search and filtering


### 📊 Community Engagement

- "Earth Echoes" community severity assessment tool
- Verification system for confirming reported issues
- Follow and notification system for issue updates
- Comment and discussion features


### 🧠 AI-Powered Analysis

- Automatic image analysis using Google's Gemini API
- Environmental context enhancement for reported locations
- Suggested descriptions and tags for reports
- Hazardous material detection in images


### 📈 User Dashboard

- Personal impact tracking and statistics
- Report status monitoring
- Verification and contribution history
- Environmental impact visualization


## 🛠️ Technologies Used

### Frontend

- **Next.js 13** with App Router for server components and routing
- **React 18** for interactive UI components
- **Tailwind CSS** for responsive styling
- **shadcn/ui** for accessible UI components
- **Framer Motion** for smooth animations and transitions


### Backend

- **Next.js API Routes** for serverless backend functionality
- **MongoDB Atlas** for database storage and geospatial queries
- **Server Actions** for secure form handling and data mutations
- **Vercel Blob Storage** for image storage and retrieval


### AI & Machine Learning

- **Google Gemini Pro Vision** for image analysis and classification
- **Google Gemini Pro** for location context enhancement
- **Structured data extraction** for environmental insights


### Maps & Geospatial

- **Leaflet.js** for interactive maps
- **OpenStreetMap** for base map tiles
- **Geolocation API** for user location detection
- **Nominatim** for reverse geocoding


## 📋 Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB Atlas account
- Google AI Studio account (for Gemini API)
- Vercel account (optional, for deployment)


### Environment Variables

Create a `.env.local` file with the following variables:

```plaintext
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Optional: Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Installation

1. Clone the repository


```shellscript
git clone https://github.com/yourusername/birthsafe-dashboard.git
cd birthsafe-dashboard
```

2. Install dependencies


```shellscript
npm install
# or
yarn install
```

3. Run the development server


```shellscript
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser


## 🔌 API Integrations

### MongoDB Integration

The application uses MongoDB Atlas for data storage with the following collections:

- `reports`: Environmental issue reports with geospatial indexing
- `users`: User profiles and authentication data
- `comments`: Community discussions on reports
- `verifications`: Verification records for reported issues


Example MongoDB schema for reports:

```javascript
{
  id: ObjectId,
  image_url: String,
  label: String,
  severity: Number,
  upvotes: Number,
  location: {
    type: "Point",
    coordinates: [Number, Number] // [longitude, latitude]
  },
  locationName: String,
  notifyAuthority: Boolean,
  timestamp: Date,
  description: String,
  type: String,
  tags: [String],
  potentialHazards: [String],
  locationContext: Object,
  userId: ObjectId
}
```

### Google Gemini API Integration

The application leverages Google's Gemini API for AI-powered analysis:

1. **Image Analysis** (`/app/actions/analyze-image.ts`):

1. Uses Gemini Pro Vision to analyze environmental images
2. Extracts issue descriptions, types, severity, and potential hazards
3. Generates tags and suggested descriptions



2. **Location Context** (`/app/actions/enhance-location.ts`):

1. Uses Gemini Pro to enhance location data with environmental context
2. Provides information about nearby environmental features
3. Estimates potential impact radius and applicable regulations





Example Gemini API response structure:

```javascript
{
  success: true,
  data: {
    description: "Large pile of construction waste dumped near a water body...",
    issueType: "Dumping",
    severityScore: 4,
    severityReason: "Proximity to water increases risk of contamination...",
    tags: ["#IllegalDumping", "#WaterPollution", "#ConstructionWaste"],
    potentialHazards: ["Chemical leaching", "Water contamination"],
    suggestedDescription: "Construction debris illegally dumped near river..."
  }
}
```

## 📱 Key Components

### Report Form with AI (`/components/report-form-with-ai.tsx`)

- Handles image upload and analysis
- Integrates with Gemini API for automatic classification
- Provides AI-suggested descriptions and tags
- Captures user location and enhances with environmental context


### Interactive Map (`/components/reports-map.tsx`)

- Displays reported issues on an interactive map
- Supports filtering by issue type and severity
- Provides detailed popups with issue information
- Handles clustering for dense areas


### Earth Echoes (`/components/earth-echoes.tsx`)

- Community-driven severity assessment tool
- Visualizes collective environmental impact assessments
- Provides educational tooltips about severity criteria
- Animates user interactions for engaging experience


### Verification Flow (`/components/verification-flow.tsx`)

- Multi-step verification process for reported issues
- Location verification using geolocation
- Photo evidence capture and submission
- Observation recording for verification context


## 🔄 Data Flow

1. **Report Submission**:

1. User captures/uploads image → Client
2. Image sent to server action → Server
3. Server action calls Gemini API → External API
4. AI analysis returned to client → Client
5. User confirms/edits analysis → Client
6. Complete report submitted to API route → Server
7. Report stored in MongoDB → Database



2. **Map Visualization**:

1. Client requests reports → Server
2. API route queries MongoDB with geospatial filters → Database
3. Filtered reports returned to client → Client
4. Reports rendered on interactive map → Client



3. **Verification Process**:

1. User initiates verification → Client
2. Location verified via browser geolocation → Client
3. Verification photo captured → Client
4. Verification data submitted to API route → Server
5. Verification stored and linked to report → Database





## 🧪 Testing

### Debug Tools

The application includes a debug page for testing API integrations:

- `/app/debug-gemini/page.tsx`: Test Gemini API image analysis and location context enhancement


### Running Tests

```shellscript
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Gemini API Documentation](https://ai.google.dev/docs/gemini_api)
- [Leaflet.js Documentation](https://leafletjs.com/reference.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.



Built with ❤️ for the planet 🌍 by Rajashekar Vennavelli@