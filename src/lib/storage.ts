import { list, put, del } from '@vercel/blob';

export async function getPhotos(unit: string): Promise<string[]> {
  const { blobs } = await list({ prefix: `uploads/${unit}/` });
  return blobs
    .filter(b => b.pathname.startsWith(`uploads/${unit}/`))
    .map(b => b.url);
}

export async function getFirstPhoto(unit: string): Promise<string | null> {
  const { blobs } = await list({ prefix: `uploads/${unit}/` });
  const match = blobs.find(b => b.pathname.startsWith(`uploads/${unit}/`));
  return match?.url ?? null;
}

export async function getReviews(): Promise<string[]> {
  const { blobs } = await list({ prefix: 'uploads/reviews/' });
  return blobs
    .filter(b => b.pathname.startsWith('uploads/reviews/'))
    .map(b => b.url);
}

export async function getBlockedDates(): Promise<{ upper: string[]; lower: string[] }> {
  try {
    const { blobs } = await list({ prefix: 'data/blocked_dates.json' });
    if (blobs.length === 0) return { upper: [], lower: [] };
    const res = await fetch(blobs[0].url, { cache: 'no-store' });
    return await res.json();
  } catch {
    return { upper: [], lower: [] };
  }
}

export async function saveBlockedDates(data: { upper: string[]; lower: string[] }) {
  await put('data/blocked_dates.json', JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export { del };
