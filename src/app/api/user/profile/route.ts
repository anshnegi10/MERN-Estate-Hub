import { NextResponse } from 'next/server';
import { connectDB } from '@/database/connection';
import User from '@/database/models/User';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

/** Helper: extract and verify JWT from Authorization header or cookies */
async function getUserId(req: Request): Promise<string | null> {
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
    const payload = verifyToken(token) as { userId: string };
    console.log('[Profile API] Token verified for userId:', payload.userId);
    return payload.userId;
  } catch (err: any) {
    console.warn('[Profile API] Token verification failed:', err.message);
    return null;
  }
}

/** GET /api/user/profile */
export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const user = await User.findById(userId).select('-password -resetOtp -resetOtpExpiry');
    if (!user) {
      console.warn('[Profile API] User not found in DB for userId:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log('[Profile API] User fetched from DB:', user.email);
    return NextResponse.json({ user });
  } catch (err: any) {
    console.error('[Profile API] Server error:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/** PUT /api/user/profile — update name, phone, avatar */
export async function PUT(req: Request) {
  const userId = await getUserId(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await req.json();
    const allowed = ['name', 'phone', 'avatar'];
    const update: Record<string, string> = { updatedAt: new Date().toISOString() };
    for (const key of allowed) {
      if (key in body && typeof body[key] === 'string') {
        update[key] = body[key];
      }
    }
    const user = await User.findByIdAndUpdate(userId, update, { new: true }).select('-password -resetOtp -resetOtpExpiry');
    if (!user) {
      console.warn('[Profile API] User not found for update, userId:', userId);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    console.log('[Profile API] User profile updated in DB:', user.email);
    return NextResponse.json({ user });
  } catch (err: any) {
    console.error('[Profile API] Server error on update:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
