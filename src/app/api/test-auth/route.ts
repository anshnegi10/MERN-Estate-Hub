import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/database/connection';
import User from '@/database/models/User';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET(req: Request) {
    try {
        let token = '';
        const authHeader = req.headers.get('authorization');
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        } else {
            const cookieStore = await cookies();
            token = cookieStore.get('token')?.value || '';
        }

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized: No token provided' }, { status: 401 });
        }

        const decoded = verifyToken(token) as { userId: string; email: string; role?: string };
        if (!decoded || !decoded.userId) {
            return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token payload' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ success: false, error: 'Unauthorized: Token expired' }, { status: 401 });
        }
        return NextResponse.json({ success: false, error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
}
