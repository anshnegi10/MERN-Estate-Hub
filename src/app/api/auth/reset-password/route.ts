import { NextResponse } from 'next/server';
import { findUserById } from '@/repositories/user.repo';
import User from '@/database/models/User';
import { connectDB } from '@/database/connection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    try {
        const { token, newPassword } = await req.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not configured");
        }

        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                return NextResponse.json({ error: "Reset link has expired" }, { status: 400 });
            }
            return NextResponse.json({ error: "Invalid token" }, { status: 400 });
        }

        const userId = decoded.userId;
        if (!userId) {
            return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
        }

        await connectDB();
        const user = await User.findById(userId);
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
