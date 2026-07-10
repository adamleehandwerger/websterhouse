import { NextRequest, NextResponse } from 'next/server';
import { getBlockedDates, saveBlockedDates } from '@/lib/storage';

export async function GET() {
  return NextResponse.json(await getBlockedDates());
}

export async function POST(req: NextRequest) {
  const { unit, date, action } = await req.json();

  if (!['upper', 'lower'].includes(unit as string)) {
    return NextResponse.json({ error: 'Invalid unit' }, { status: 400 });
  }

  const data = await getBlockedDates();
  const list: string[] = data[unit as 'upper' | 'lower'] ?? [];

  if (action === 'add' && !list.includes(date)) {
    list.push(date);
  } else if (action === 'remove') {
    data[unit as 'upper' | 'lower'] = list.filter((d: string) => d !== date);
    await saveBlockedDates(data);
    return NextResponse.json({ ok: true });
  }

  data[unit as 'upper' | 'lower'] = list;
  await saveBlockedDates(data);
  return NextResponse.json({ ok: true });
}
