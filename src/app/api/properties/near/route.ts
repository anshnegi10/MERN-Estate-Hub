import { NextResponse } from "next/server";
import { findNearbyProperties } from "@/services/property.service";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const radius = searchParams.get("radius");

        if (!lat || !lng || !radius) {
            return NextResponse.json(
                { error: "Must provide lat, lng, and radius parameters" },
                { status: 400 }
            );
        }

        const properties = await findNearbyProperties(
            parseFloat(lng),
            parseFloat(lat),
            parseInt(radius)
        );
        
        return NextResponse.json(properties, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch nearby properties" },
            { status: 500 }
        );
    }
}
