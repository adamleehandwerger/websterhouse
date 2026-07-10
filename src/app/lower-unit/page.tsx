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

export default async function LowerUnit() {
  const [blockedDates, photos] = await Promise.all([
    getBlockedDates('lower'),
    getPhotos('lower'),
  ]);

  return (
    <UnitPage
      unit="lower"
      title="Lower Unit"
      description="A cozy, private retreat with its own entrance. Ideal for couples or solo travelers looking for a quiet and comfortable stay."
      photos={photos}
      blockedDates={blockedDates}
    />
  );
}
