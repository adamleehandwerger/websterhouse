import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const reviewDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const files = form.getAll('files') as File[];

  await fs.mkdir(reviewDir, { recursive: true });

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith('.png')) continue;
    const bytes = await file.arrayBuffer();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    await fs.writeFile(path.join(reviewDir, filename), Buffer.from(bytes));
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { filename } = await req.json();
  const safe = path.basename(filename as string);
  try {
    await fs.unlink(path.join(reviewDir, safe));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
