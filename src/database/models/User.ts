import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  phone:     { type: String, default: '' },
  role:      { type: String, enum: ["student", "owner"], required: true },
  avatar:    { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resetOtp: { type: String, default: '' },
  resetOtpExpiry: { type: Date }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
