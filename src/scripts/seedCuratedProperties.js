const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('ts-node/register');
const { PROPERTIES } = require('../data/curatedProperties');

const Property = require('../database/models/Property').default || require('../database/models/Property');

async function seedCuratedProperties() {
    try {
        console.log("Connecting to MongoDB:", process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected Successfully.");

        console.log("Emptying old properties...");
        await Property.deleteMany({});
        console.log("Cleared.");

        console.log("Syncing indexes (including 2dsphere)...");
        await Property.syncIndexes();
        
        console.log("Uploading curated dataset...");
        let insertedCount = 0;
        
        for (const p of PROPERTIES) {
            const newProp = new Property({
                name: p.name,
                title: p.name,
                tagline: p.tagline,
                locationStr: p.location,
                city: p.city,
                type: p.type,
                propertyType: p.type,
                category: p.category,
                price: p.price,
                priceLabel: p.priceLabel,
                perLabel: p.perLabel,
                beds: p.beds,
                baths: p.baths,
                area: p.area,
                rating: p.rating,
                reviews: p.reviews,
                description: p.description,
                gradient: p.gradient,
                builder: p.builder,
                lat: p.lat,
                lng: p.lng,
                rera: p.rera,
                badge: p.badge,
                highlight: p.highlight,
                specs: p.specs,
                amenities: p.amenities,
                state: 'Uttarakhand',
                collegeNearby: new mongoose.Types.ObjectId().toString(),
                images: [],
                ownerId: new mongoose.Types.ObjectId().toString(),
                location: {
                    type: 'Point',
                    coordinates: [p.lng, p.lat]
                }
            });
            await newProp.save();
            insertedCount++;
        }

        console.log(`Successfully populated database with ${insertedCount} curated properties from typescript module.`);
    } catch (err) {
        console.error("Error seeding properties:", err);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

seedCuratedProperties();
