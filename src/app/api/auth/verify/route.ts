import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
    try {
        const { token } = await req.json();
        
        if (!token) {
            return NextResponse.json({ valid: false }, { status: 400 });
        }

        // Verify using jwt.verify() inside our nodejs runtime
        const decoded = verifyToken(token);
        
        return NextResponse.json({ valid: true, user: decoded }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ valid: false }, { status: 401 });
    }
}
