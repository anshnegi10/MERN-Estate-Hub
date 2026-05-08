import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  // User info
  userId:        { type: String, required: false, default: 'anonymous_user' },
  fullName:      { type: String, required: true },
  phone:         { type: String, required: true },
  email:         { type: String, required: true },

  // Property info
  propertyId:    { type: String, required: true },
  propertyTitle: { type: String, required: true },
  ownerId:       { type: String, required: false, default: 'demo_owner' },

  // Visit details
  date:          { type: String, required: true },
  time:          { type: String, required: true },
  message:       { type: String, required: false, default: '' },

  // Status lifecycle: pending → approved | rejected
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Auto-update updatedAt on save
BookingSchema.pre('save', function (next: any) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
