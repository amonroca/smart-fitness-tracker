const { MongoClient } = require('mongodb');

let client;
let db;
let isConnected = false;

async function connectDb(uri = process.env.DATABASE_URL) {
  if (!uri) {
    const msg = 'DATABASE_URL not set. Cannot connect to MongoDB.';
    console.error(msg);
    throw new Error(msg);
  }

  // If already connected, reuse existing db
  if (isConnected && db) {
    return db;
  }

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    isConnected = true;
    console.log('MongoDB connected successfully.');
    return db;
  } catch (err) {
    // Ensure state is clean on failure
    client = undefined;
    db = undefined;
    isConnected = false;
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

function getDb() {
  return db;
}

function getConnectionState() {
  return isConnected;
}

async function disconnectDb() {
  try {
    if (client) {
      await client.close();
    }
  } finally {
    isConnected = false;
    db = undefined;
    client = undefined;
    console.log('MongoDB connection closed.');
  }
}

module.exports = { connectDb, getDb, getConnectionState, disconnectDb };