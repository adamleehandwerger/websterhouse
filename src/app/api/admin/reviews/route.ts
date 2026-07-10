import { NextRequest, NextResponse } from 'next/server';
import { uploadReview, deleteAsset } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const files = form.getAll('files') as File[];

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.png')) continue;
    await uploadReview(file);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { publicId } = await req.json();
  await deleteAsset(publicId);
  return NextResponse.json({ ok: true });
}
