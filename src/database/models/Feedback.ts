import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
    propertyId: { type: String, required: true },
    propertyName: { type: String, required: true },
    issueType: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, default: 'Anonymous' },
    email: { type: String, default: '' },
    anonymous: { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
