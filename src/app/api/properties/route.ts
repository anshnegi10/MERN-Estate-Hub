import { NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import PropertyModel from "@/database/models/Property";
import { Property as PropertyInterface } from "@/types/property";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(req.url);
        
        const query = searchParams.get("query")?.toLowerCase();
        const city = searchParams.get("city");
        const category = searchParams.get("category");
        const beds = searchParams.get("beds");
        const ownerId = searchParams.get("ownerId");

        let filter: any = {};

        if (ownerId) {
            filter.ownerId = ownerId;
        }
        
        if (city && city !== 'all' && city !== 'All') {
            filter.city = { $regex: new RegExp(city, "i") };
        }
        
        // Mongoose doesn't support 'beds' directly on the old schema out of the box so map approximations if necessary.
        // Assuming the DB schema aligns with standard values or use regex on descriptions if needed.
        
        const dbProperties = await PropertyModel.find(filter).limit(50);
        
        // Map raw MongoDB data logic to the strict Property interface desired on the frontend
        const mappedProperties: PropertyInterface[] = dbProperties.map((p: any) => ({
            id: p._id.toString(),
            name: p.name || p.title || "Unknown Property",
            tagline: p.tagline || "",
            location: p.locationStr || p.city || "",
            city: p.city || "Unknown",
            type: p.type || "apartment",
            category: p.category || "rent",
            price: p.price || 0,
            priceLabel: p.priceLabel || `₹${p.price?.toLocaleString() || '0'}`,
            perLabel: p.perLabel || '/month',
            beds: p.beds || 1,
            baths: p.baths || 1,
            area: p.area || '500',
            rating: p.rating || 4.5,
            reviews: p.reviews || 0,
            description: p.description || "",
            gradient: p.gradient || 'from-green-300 via-emerald-400 to-teal-500',
            builder: p.builder || 'Independent',
            lat: p.lat || p.location?.coordinates?.[1] || 0,
            lng: p.lng || p.location?.coordinates?.[0] || 0,
            rera: p.rera || undefined,
            badge: p.badge || undefined,
            highlight: p.highlight || undefined,
            specs: p.specs || [],
            amenities: p.amenities || [],
            images: p.images || [],
            contact: p.contact ? { name: p.contact.split(':')[0] || "Owner", phone: p.contact.split(':')[1] || p.contact } : undefined
        }));

        // Apply remaining query/category/bed frontend-spec filtering on mapped data
        let results = mappedProperties;
        
        if (query) {
            results = results.filter(p => [p.name, p.location, p.city, p.builder].some(f => f.toLowerCase().includes(query)));
        }
        
        if (category && category !== 'all') {
            results = results.filter(p => p.category === category || (category === 'villa' && p.type === 'villa'));
        }
        
        if (beds) {
            results = results.filter(p => p.beds >= parseInt(beds));
        }

        return NextResponse.json(results, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch properties" },
            { status: 500 }
        );
    }
}
