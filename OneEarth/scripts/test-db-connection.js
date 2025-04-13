const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log(`Connection string: ${process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Create a simple test collection
    const Test = mongoose.model('Test', new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    }));
    
    // Create a test document
    const testDoc = await Test.create({ name: 'Connection Test' });
    console.log(`✅ Created test document with ID: ${testDoc._id}`);
    
    // Clean up - delete the test document
    await Test.deleteOne({ _id: testDoc._id });
    console.log('✅ Cleaned up test document');
    
    // Close the connection
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error(error);
  }
}

testConnection();
