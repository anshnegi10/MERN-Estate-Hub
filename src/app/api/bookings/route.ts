import { NextResponse } from 'next/server';
import Booking from '@/database/models/Booking';
import { connectDB } from '@/database/connection';

/**
 * POST /api/bookings
 * Submit a new visit request with full contact info.
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate required fields
    const { fullName, phone, email, propertyId, propertyTitle, date, time } = body;
    if (!fullName || !phone || !email || !propertyId || !propertyTitle || !date || !time) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: fullName, phone, email, propertyId, propertyTitle, date, time' },
        { status: 400 }
      );
    }

    const booking = await Booking.create({
      userId:        body.userId        || 'anonymous_user',
      fullName,
      phone,
      email,
      propertyId,
      propertyTitle,
      ownerId:       body.ownerId       || 'demo_owner',
      date,
      time,
      message:       body.message       || '',
      status:        'pending',
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error('Booking POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create booking request' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings?userId=xxx  — user's own requests
 * GET /api/bookings?ownerId=xxx — owner/admin view of requests for their properties
 * GET /api/bookings             — all (admin fallback)
 */
export async function GET(req: Request) {
  try {
    await connectDB();
    const url    = new URL(req.url);
    const userId  = url.searchParams.get('userId');
    const ownerId = url.searchParams.get('ownerId');

    const query: Record<string, string> = {};
    if (userId)  query.userId  = userId;
    if (ownerId) query.ownerId = ownerId;

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error('Booking GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch bookings' }, { status: 500 });
  }
}

/**
 * PATCH /api/bookings
 * Body: { id: string, status: 'approved' | 'rejected' }
 * Owner/admin updates request status.
 */
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'id and a valid status (approved/rejected/pending) are required' },
        { status: 400 }
      );
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json({ success: false, message: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, booking });
  } catch (error) {
    console.error('Booking PATCH error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update booking' }, { status: 500 });
  }
}
