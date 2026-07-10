import { NextResponse } from 'next/server';
import { getReviews } from '@/lib/storage';

export async function GET() {
  return NextResponse.json({ reviews: await getReviews() });
}
