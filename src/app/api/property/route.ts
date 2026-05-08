import { NextResponse } from "next/server";
import { connectDB } from "@/database/connection";
import Property from "@/database/models/Property";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

/** Helper: extract and verify JWT from Authorization header or cookies */
async function getUserContext(req: Request): Promise<{ userId: string; role: string } | null> {
  let token = '';
  const auth = req.headers.get('authorization') || '';

  if (auth.startsWith('Bearer ')) {
    token = auth.replace('Bearer ', '').trim();
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get('token')?.value || '';
  }

  if (!token) return null;

  try {
    const payload = verifyToken(token) as { userId: string; role: string };
    return { userId: payload.userId, role: payload.role };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
    try {
        const userContext = await getUserContext(req);
        
        if (!userContext) {
            return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
        }

        if (userContext.role !== 'owner') {
            return NextResponse.json({ error: "Access denied. Only property owners can submit listings." }, { status: 403 });
        }

        const userId = userContext.userId;
        
        // Connect to MongoDB
        await connectDB();

        
        // Parse the request body
        const body = await req.json();
        console.log("[Property API] Submission attempt for:", body.name);
        
        const {
            name,
            address,
            contact,
            amount,
            sharingBasis,
            propertyType,
            facilities,
            images,
            video
        } = body;

        // Basic validation
        if (!name || !address || !contact || !amount || !sharingBasis || !propertyType) {
            return NextResponse.json(
                { error: "Please fill in all required fields." },
                { status: 400 }
            );
        }

        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json(
                { error: "Invalid amount provided." },
                { status: 400 }
            );
        }

        // Prepare the new property document
        const propertyData: any = {
            name,
            address,
            contact,
            amount: Number(amount),
            price: Number(amount), // Sync with legacy field
            sharingBasis,
            propertyType,
            type: propertyType, // Sync with legacy field
            facilities: facilities || [],
            amenities: facilities || [], // Sync with legacy field
            images: images && images.length > 0 ? images : ["https://images.unsplash.com/photo-1554995207-c18c203602cb"], // Default placeholder
            video: video || "",
            location: {
                type: "Point",
                coordinates: [78.0322, 30.3165] // Default Dehradun coordinates to satisfy 2dsphere index
            },
            createdAt: new Date()
        };

        if (userId) {
            propertyData.ownerId = userId;
        }

        // Save to database
        const property = await Property.create(propertyData);

        return NextResponse.json(
            { 
                success: true, 
                property 
            }, 
            { status: 201 }
        );

    } catch (error: any) {
        console.error("[Property Submission API] Error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
