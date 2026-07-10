import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFile = path.join(process.cwd(), 'data', 'blocked_dates.json');

interface BlockedDates { upper: string[]; lower: string[] }

async function read(): Promise<BlockedDates> {
  try {
    return JSON.parse(await fs.readFile(dataFile, 'utf-8'));
  } catch {
    return { upper: [], lower: [] };
  }
}

async function write(data: BlockedDates) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

export async function GET() {
  return NextResponse.json(await read());
}

export async function POST(req: NextRequest) {
  const { unit, date, action } = await req.json();

  if (!['upper', 'lower'].includes(unit as string)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  const data = await read();
  const list: string[] = data[unit as 'upper' | 'lower'] ?? [];

  if (action === 'add' && !list.includes(date)) {
    list.push(date);
  } else if (action === 'remove') {
    data[unit as 'upper' | 'lower'] = list.filter(d => d !== date);
    await write(data);
    return NextResponse.json({ ok: true });
  }

  data[unit as 'upper' | 'lower'] = list;
  await write(data);
  return NextResponse.json({ ok: true });
}
