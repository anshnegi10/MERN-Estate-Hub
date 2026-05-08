import { connectDB } from "@/database/connection";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const dbName = mongoose.connection.name;

    console.log(`[Health Check] DB Status: Connected | Database: ${dbName}`);

    return NextResponse.json({
      status: "connected",
      database: dbName
    }, { status: 200 });
  } catch (error: any) {
    console.error("[Health Check] Failed:", error.message);
    return NextResponse.json({
      status: "disconnected",
      error: error.message
    }, { status: 500 });
  }
}
