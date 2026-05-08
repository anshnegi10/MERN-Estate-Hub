import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            index: "2dsphere"
        }
    }
});

export default mongoose.models.College || mongoose.model("College", CollegeSchema);
