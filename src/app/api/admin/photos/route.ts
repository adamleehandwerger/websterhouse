import { NextRequest, NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const unit = form.get('unit') as string;
  const files = form.getAll('files') as File[];

  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    await put(`uploads/${unit}/${filename}`, file, { access: 'public' });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { url } = await req.json();
  await del(url);
  return NextResponse.json({ ok: true });
}
