import { NextResponse } from "next/server";
import { fetchCities } from "@/services/search.service";

export async function GET(req: Request) {
    try {
        const cities = await fetchCities();
        return NextResponse.json(cities, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch cities" },
            { status: 500 }
        );
    }
}
