const mongoose = require("mongoose");

async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set. Add it to your environment variables.");
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    return true;
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
}

async function closeDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
}

module.exports = {
  connectDatabase,
  closeDatabase
};
