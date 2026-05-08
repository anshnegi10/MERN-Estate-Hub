import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/database/connection';
import User from '@/database/models/User';
import { verifyToken } from '@/lib/jwt';

/**
 * GET /api/auth/me
 * Reads JWT from Authorization header OR httpOnly cookie,
 * verifies it, fetches user from MongoDB, and returns user data.
 */
export async function GET(req: Request) {
  try {
    // 1. Extract token from Authorization header or cookie
    let token = '';
    const authHeader = req.headers.get('authorization') || '';

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.replace('Bearer ', '').trim();
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('token')?.value || '';
    }

    if (!token) {
      console.warn('[/api/auth/me] No token provided');
      return NextResponse.json({ error: 'Unauthorized — no token' }, { status: 401 });
    }

    // 2. Verify JWT
    let payload: { userId: string; email: string };
    try {
      payload = verifyToken(token) as { userId: string; email: string };
      console.log('[/api/auth/me] Token verified for userId:', payload.userId);
    } catch (err: any) {
      console.warn('[/api/auth/me] Token verification failed:', err.message);
      return NextResponse.json({ error: 'Unauthorized — invalid token' }, { status: 401 });
    }

    // 3. Connect to MongoDB and fetch user
    await connectDB();
    const user = await User.findById(payload.userId).select('-password -resetOtp -resetOtpExpiry');

    if (!user) {
      console.warn('[/api/auth/me] User not found in DB for userId:', payload.userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('[/api/auth/me] User fetched from DB:', user.email);

    // 4. Return user data
    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        avatar: user.avatar || '',
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error('[/api/auth/me] Unexpected error:', error.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
