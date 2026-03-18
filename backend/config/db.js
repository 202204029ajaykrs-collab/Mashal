const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn('⚠️  MONGO_URI not set. Skipping MongoDB connection.');
    return;
  }

  try {
    await mongoose.connect(uri, {
      // Using defaults; options like useNewUrlParser/useUnifiedTopology are set by Mongoose 7+.
    });
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);

    // Provide a helpful hint (common causes)
    console.error('   • Check MONGO_URI in backend/.env');
    console.error('   • Ensure your MongoDB Atlas IP whitelist includes your current IP');
    console.error('   • If using a local MongoDB, set MONGO_URI to mongodb://127.0.0.1:27017/<dbName>');

    // Try fallback to local MongoDB (for development convenience)
    const localUri = process.env.MONGO_LOCAL_URI || 'mongodb://127.0.0.1:27017/mashal';
    if (uri !== localUri) {
      console.log(`Attempting fallback to local MongoDB at ${localUri} ...`);
      try {
        await mongoose.connect(localUri);
        console.log('✅ Connected to local MongoDB fallback');
        return;
      } catch (localErr) {
        console.error('❌ Local MongoDB fallback failed:', localErr.message);
      }
    }

    console.warn('⚠️  Backend will keep running, but MongoDB-related endpoints will fail until the database is reachable.');
  }
};

module.exports = connectDB;
