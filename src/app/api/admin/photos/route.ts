import { NextRequest, NextResponse } from 'next/server';
import { uploadPhoto, deleteAsset } from '@/lib/storage';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const unit = form.get('unit') as string;
  const files = form.getAll('files') as File[];

  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  try {
    for (const file of files) {
      await uploadPhoto(unit, file);
    }
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { publicId } = await req.json();
  await deleteAsset(publicId);
  return NextResponse.json({ ok: true });
}
