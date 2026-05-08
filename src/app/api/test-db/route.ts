import { connectDB } from "@/database/connection";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();

    const TestModel =
      mongoose.models.Test ||
      mongoose.model(
        "Test",
        new mongoose.Schema({
          name: String,
          createdAt: { type: Date, default: Date.now },
        })
      );

    const doc = await TestModel.create({ name: "MongoDB Working" });

    return Response.json({
      success: true,
      message: "MongoDB connected and write successful ✅",
      data: doc,
    });
  } catch (error: any) {
    console.error("MongoDB Error:", error);
    return Response.json(
      {
        success: false,
        message: "MongoDB connection failed ❌",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
