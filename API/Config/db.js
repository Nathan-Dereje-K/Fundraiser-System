const mongoose = require("mongoose");
require('colors');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Recommended options:
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      retryReads: true
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`.cyan.bold.underline);
    return conn.connection; // THIS IS CRUCIAL
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`.red.bold);
    process.exit(1);
  }
};

module.exports = connectDB;