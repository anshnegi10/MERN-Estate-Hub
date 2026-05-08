import { NextResponse } from "next/server";
import { fetchColleges } from "@/services/search.service";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city") || undefined;
        
        const colleges = await fetchColleges(city);
        return NextResponse.json(colleges, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch colleges" },
            { status: 500 }
        );
    }
}
