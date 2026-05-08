import { NextResponse } from 'next/server';
import { connectDB } from '@/database/connection';
import Booking from '@/database/models/Booking';
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

/** GET /api/requests/user — all requests by the logged-in user */
export async function GET(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const requests = await Booking.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, requests });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

/** DELETE /api/requests/user?id=xxx — cancel a pending request */
export async function DELETE(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const booking = await Booking.findOne({ _id: id, userId });
    if (!booking) return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    if (booking.status !== 'pending') {
      return NextResponse.json({ error: 'Only pending requests can be cancelled' }, { status: 400 });
    }

    await Booking.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Request cancelled' });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
