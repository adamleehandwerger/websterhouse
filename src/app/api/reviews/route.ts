import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
    const files = await fs.readdir(dir);
    const reviews = files
      .filter(f => /\.png$/i.test(f))
      .map(f => `/uploads/reviews/${f}`);
    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}
