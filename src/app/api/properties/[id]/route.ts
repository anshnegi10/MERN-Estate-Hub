import { NextResponse } from "next/server";
import { fetchProperty } from "@/services/property.service";
import Property from "@/database/models/Property";
import { connectDB } from "@/database/connection";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const property = await fetchProperty(id);
        
        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        
        return NextResponse.json(property, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to fetch property" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token) as { userId: string, role: string };
        await connectDB();
        
        const property = await Property.findById(id);
        if (!property) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        // Only owner or admin can delete
        if (property.ownerId !== payload.userId && payload.role !== 'admin') {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await Property.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Property deleted" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
