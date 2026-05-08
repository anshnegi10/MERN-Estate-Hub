import { NextResponse } from 'next/server';
import { connectDB } from '@/database/connection';
import { verifyToken } from '@/lib/jwt';
import { demoProperties } from '@/data/demoProperties';

// In-memory wishlist store (localStorage is the real store on the client).
// This API is a companion endpoint to let the client sync/retrieve wishlist by propertyId list.
// The client sends its localStorage wishlist IDs and we return enriched property data.

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

/** POST /api/wishlist/sync — accepts { propertyIds: string[] }, returns enriched property data */
export async function POST(req: Request) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const ids: string[] = body.propertyIds || [];

    // Match against demo properties dataset
    const wishlistedProperties = demoProperties.filter((p) => ids.includes(p.id));
    return NextResponse.json({ success: true, properties: wishlistedProperties });
  } catch {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
