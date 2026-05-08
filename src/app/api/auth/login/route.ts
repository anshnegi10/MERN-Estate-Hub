import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loginUser } from "@/services/auth.service";
import { loginSchema } from "@/utils/validation";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[Login API] Login attempt for:", body.email);

        const validationResult = loginSchema.safeParse(body);
        if (!validationResult.success) {
            console.warn("[Login API] Validation failed:", validationResult.error.flatten().fieldErrors);
            return NextResponse.json(
                { error: "Validation failed", details: validationResult.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const result = await loginUser(validationResult.data);

        // Store JWT in HTTP-only cookie (server-side, secure)
        const cookieStore = await cookies();
        cookieStore.set("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
            sameSite: "lax",
        });

        console.log("[Login API] Login successful — JWT stored in httpOnly cookie for:", result.user.email);

        // Also return token in response body for client-side localStorage usage
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("[Login API] Error:", error.message);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 401 }
        );
    }
}
