const mongoose = require('mongoose');

let connectPromise = null;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectPromise) {
    return connectPromise;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not configured');
  }

  connectPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false,
    })
    .finally(() => {
      connectPromise = null;
    });

  return connectPromise;
}

module.exports = connectToDatabase;
