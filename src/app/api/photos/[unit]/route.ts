import { NextRequest, NextResponse } from 'next/server';
import { getPhotos } from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: { unit: string } }
) {
  const { unit } = params;
  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }
  return NextResponse.json({ photos: await getPhotos(unit) });
}
