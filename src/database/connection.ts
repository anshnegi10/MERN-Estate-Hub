import mongoose from "mongoose"

let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
            bufferCommands: false
        }).then((mongooseInstance) => {
            console.log("✅ MongoDB connected successfully");
            console.log(`📦 Database: ${mongooseInstance.connection.name}`);
            return mongooseInstance;
        }).catch((error) => {
            console.error("❌ MongoDB connection failed:", error.message);
            cached.promise = null; // Reset promise so next call retries
            throw error;
        });
    }

    cached.conn = await cached.promise
    return cached.conn
}