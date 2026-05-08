import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectDB } from '@/database/connection';
import User from '@/database/models/User';
import { verifyToken } from '@/lib/jwt';

function getUserId(req: Request): string | null {
  const auth = req.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '').trim();
  if (!token) return null;
  try {
    const payload = verifyToken(token) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

/** PUT /api/user/password — change password */
export async function PUT(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { currentPassword, newPassword } = await req.json();
    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'currentPassword and newPassword (min 6 chars) are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed, updatedAt: new Date() });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
