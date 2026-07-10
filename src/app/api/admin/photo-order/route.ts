import { NextRequest, NextResponse } from 'next/server';
import { savePhotoOrder } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const { unit, order } = await req.json();
  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }
  await savePhotoOrder(unit, order);
  return NextResponse.json({ ok: true });
}
