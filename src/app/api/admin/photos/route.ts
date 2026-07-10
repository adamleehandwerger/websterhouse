import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const uploadDir = (unit: string) =>
  path.join(process.cwd(), 'public', 'uploads', unit);

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const unit = form.get('unit') as string;
  const files = form.getAll('files') as File[];

  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  const dir = uploadDir(unit);
  await fs.mkdir(dir, { recursive: true });

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    await fs.writeFile(path.join(dir, filename), Buffer.from(bytes));
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { unit, filename } = await req.json();

  if (!['upper', 'lower'].includes(unit)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  // path.basename prevents directory traversal
  const safe = path.basename(filename as string);
  try {
    await fs.unlink(path.join(uploadDir(unit), safe));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
