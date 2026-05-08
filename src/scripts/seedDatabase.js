require("ts-node/register")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")

const MONGODB_URI = "mongodb://127.0.0.1:27017/estatehub"

async function seed() {

    await mongoose.connect(MONGODB_URI)

    const colleges = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../seed/colleges.json"),
            "utf8"
        )
    )

    const properties = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, "../seed/properties.json"),
            "utf8"
        )
    )

    const College = mongoose.model(
        "College",
        new mongoose.Schema({
            name: String,
            city: String,
            state: String,
            latitude: Number,
            longitude: Number
        })
    )

    const Property = require("../database/models/Property").default

    await College.deleteMany({})
    await Property.deleteMany({})

    await College.insertMany(colleges)
    const geoProperties = properties.map(p => ({
        ...p,
        location: {
            type: "Point",
            coordinates: [p.longitude, p.latitude]
        }
    }))

    console.log("Syncing MongoDB indexes...")
    await Property.syncIndexes()

    console.log("Seeding properties...")
    await Property.insertMany(geoProperties)

    console.log("Inserted properties:", geoProperties.length)

    console.log("Database seeded successfully")

    process.exit()

}

seed()