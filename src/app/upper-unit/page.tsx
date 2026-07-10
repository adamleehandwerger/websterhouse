import { promises as fs } from 'fs';
import path from 'path';
import UnitPage from '@/components/UnitPage';

async function getBlockedDates(unit: string): Promise<string[]> {
  try {
    const data = await fs.readFile(path.join(process.cwd(), 'data', 'blocked_dates.json'), 'utf-8');
    return JSON.parse(data)[unit] ?? [];
  } catch { return []; }
}

async function getPhotos(unit: string): Promise<string[]> {
  try {
    const dir = path.join(process.cwd(), 'public', 'uploads', unit);
    const files = await fs.readdir(dir);
    return files
      .filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f))
      .map(f => `/uploads/${unit}/${f}`);
  } catch { return []; }
}

export default async function UpperUnit() {
  const [blockedDates, photos] = await Promise.all([
    getBlockedDates('upper'),
    getPhotos('upper'),
  ]);

  return (
    <UnitPage
      unit="upper"
      title="Upper Unit"
      description="Bright and spacious with an open floor plan, fully equipped kitchen, and comfortable furnishings throughout. Sleeps up to 4 guests."
      photos={photos}
      blockedDates={blockedDates}
    />
  );
}
