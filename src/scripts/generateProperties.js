const fs = require("fs")

const colleges = require("../seed/colleges.json")

function randomOffset() {
  return (Math.random() - 0.5) * 0.02
}

const propertyTypes = [
  "PG",
  "Hostel",
  "Apartment",
  "Shared Flat"
]

const titles = [
  "Student PG",
  "Budget Hostel",
  "Girls PG",
  "Boys Hostel",
  "Co-living Space",
  "Student Apartment"
]

const images = [
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
  "https://images.unsplash.com/photo-1560184897-ae75f418493e"
]

const properties = []

colleges.forEach(college => {

  for (let i = 0; i < 10; i++) {

    const lat = college.latitude + randomOffset()
    const lng = college.longitude + randomOffset()

    properties.push({
      title: titles[Math.floor(Math.random()*titles.length)],
      city: college.city,
      state: college.state,
      collegeNearby: college.name,
      price: 5000 + Math.floor(Math.random()*10000),
      propertyType: propertyTypes[Math.floor(Math.random()*propertyTypes.length)],
      latitude: lat,
      longitude: lng,
      images
    })

  }

})

fs.writeFileSync(
  "./src/seed/properties.json",
  JSON.stringify(properties, null, 2)
)

console.log("Generated", properties.length, "properties")