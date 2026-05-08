import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propertyId, reason, description } = body;

    // TODO: In a real app, save to Report collection in DB.
    console.log(`[REPORT LISTING] Property ${propertyId} reported. Reason: ${reason}. Description: ${description}`);

    return NextResponse.json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to report listing' }, { status: 500 });
  }
}
