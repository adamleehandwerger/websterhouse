import { NextRequest, NextResponse } from 'next/server';
import { getBlockedDates, saveBlockedDates } from '@/lib/storage';

export async function GET() {
  return NextResponse.json(await getBlockedDates());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { unit, action } = body;
  // Accept either a single `date` or a `dates` array for range operations
  const dates: string[] = body.dates ?? (body.date ? [body.date] : []);

  if (!['upper', 'lower'].includes(unit as string)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  const data = await getBlockedDates();
  let list: string[] = data[unit as 'upper' | 'lower'] ?? [];

  if (action === 'add') {
    const toAdd = dates.filter(d => !list.includes(d));
    list = [...list, ...toAdd];
  } else if (action === 'remove') {
    list = list.filter(d => !dates.includes(d));
  }

  data[unit as 'upper' | 'lower'] = list;
  await saveBlockedDates(data);
  return NextResponse.json({ ok: true });
}
