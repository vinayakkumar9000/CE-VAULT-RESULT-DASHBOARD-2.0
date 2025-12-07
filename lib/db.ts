import mongoose from 'mongoose';

/**
 * MongoDB connection helper for Vercel serverless functions.
 * Uses cached connection to work efficiently with serverless architecture.
 * Gracefully handles missing MONGODB_URI without crashing at import time.
 */

const MONGODB_URI = process.env.MONGODB_URI;

// Log warning only once if URI is missing
let hasWarned = false;
if (!MONGODB_URI && !hasWarned) {
  console.warn('⚠️ MongoDB not connected — MONGODB_URI is missing.');
  hasWarned = true;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
