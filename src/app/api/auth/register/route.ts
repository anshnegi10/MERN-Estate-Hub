import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { registerUser } from "@/services/auth.service";
import { registerSchema } from "@/utils/validation";
import { connectDB } from "@/database/connection";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("[Register API] Registration attempt for:", body.email);
        


        // Field Mapping if necessary (Frontend sends property_owner, Backend wants owner)
        if (body.role === "property_owner") {
            body.role = "owner";
        }
        
        // Validation
        const validationResult = registerSchema.safeParse(body);
        if (!validationResult.success) {
            const fieldErrors = validationResult.error.flatten().fieldErrors;
            console.warn("[Register API] Validation failed:", JSON.stringify(fieldErrors, null, 2));
            
            // Return descriptive errors
            let errorMessage = "Validation failed";
            if (fieldErrors.name) errorMessage = fieldErrors.name[0];
            else if (fieldErrors.email) errorMessage = fieldErrors.email[0];
            else if (fieldErrors.password) errorMessage = fieldErrors.password[0];
            else if (fieldErrors.role) errorMessage = fieldErrors.role[0];

            return NextResponse.json(
                { error: errorMessage, details: fieldErrors },
                { status: 400 }
            );
        }

        const validData = validationResult.data;

        // Ensure MongoDB is connected

        await connectDB();

        // Register User
        const result = await registerUser(validData);

        // Store JWT in HTTP-only cookie after successful registration
        const cookieStore = await cookies();
        cookieStore.set("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
            sameSite: "lax",
        });

        console.log("[Register API] Registration successful for:", result.user.email);


        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        console.error("[Register API] Error:", error.message);
        
        let status = 400;
        let message = error.message || "Something went wrong";

        if (message.includes("already exists")) {
            message = "User already exists";
            status = 409;
        }

        return NextResponse.json(
            { error: message },
            { status }
        );
    }
}
