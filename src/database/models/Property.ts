import mongoose from "mongoose"

const PropertySchema = new mongoose.Schema({
    // Shared / Legacy
    title: String,
    propertyType: String,
    state: String,
    collegeNearby: String,
    images: [String],
    video: String,
    ownerId: String,

    // Submission Form Fields
    address: String,
    contact: String,
    amount: Number,
    sharingBasis: String,
    facilities: [String],

    // New Frontend Format
    name: String,
    tagline: String,
    locationStr: String,
    city: String,
    type: String,
    category: String,
    price: Number,
    priceLabel: String,
    perLabel: String,
    beds: Number,
    baths: Number,
    area: String,
    rating: Number,
    reviews: Number,
    description: String,
    gradient: String,
    builder: String,
    lat: Number,
    lng: Number,
    rera: String,
    badge: String,
    highlight: String,
    specs: [[String]],
    amenities: [String],
    
    // Safety & Trust
    isOwnerVerified: { type: Boolean, default: false },
    isLocationVerified: { type: Boolean, default: false },
    isDocumentVerified: { type: Boolean, default: false },
    safetyScore: { type: Number, default: 0 },

    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: false // Changed to false to allow submission without map initially
        }
    }
}, { timestamps: true })

PropertySchema.index({ location: "2dsphere" })

export default mongoose.models.Property ||
    mongoose.model("Property", PropertySchema)