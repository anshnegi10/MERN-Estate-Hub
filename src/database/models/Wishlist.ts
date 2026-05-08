import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true }
});

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema);
