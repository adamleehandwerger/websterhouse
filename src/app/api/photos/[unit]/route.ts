import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  _req: NextRequest,
  { params }: { params: { unit: string } }
) {
  const { unit } = params;

  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  try {
    const dir = path.join(process.cwd(), 'public', 'uploads', unit);
    const files = await fs.readdir(dir);
    const photos = files
      .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .map(f => `/uploads/${unit}/${f}`);
    return NextResponse.json({ photos });
  } catch {
    return NextResponse.json({ photos: [] });
  }
}
