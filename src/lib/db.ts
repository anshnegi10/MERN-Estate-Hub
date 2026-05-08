/**
 * lib/db.ts — Central MongoDB Connection Utility
 *
 * This is the canonical database connection file for EstateHub.
 * All API routes and services should import connectDB from here.
 *
 * Features:
 * - Uses mongoose with connection caching to survive Next.js hot reloads
 * - Reads MONGODB_URI from environment variables only (never hardcoded)
 * - Logs success/failure clearly for terminal verification during demo
 * - Prevents duplicate connections in development mode
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "❌ Missing MONGODB_URI — please define it in your .env.local file."
  );
}

/** Global cache to reuse the connection across hot reloads in dev mode */
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if already established
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection promise if one doesn't already exist
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        const dbName = mongooseInstance.connection.name;
        console.log("✅ MongoDB connected successfully");
        console.log(`📦 Database: ${dbName}`);
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        // Reset promise so the next call retries
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
