export const dynamic = 'force-dynamic';
import UnitPage from '@/components/UnitPage';
import { getPhotos, getBlockedDates } from '@/lib/storage';

export default async function UpperUnit() {
  const [photoObjs, blocked] = await Promise.all([
    getPhotos('upper'),
    getBlockedDates(),
  ]);

  return (
    <UnitPage
      unit="upper"
      title="Upper Unit"
      description="Bright and spacious with an open floor plan, fully equipped kitchen, and comfortable furnishings throughout. Sleeps up to 4 guests."
      photos={photoObjs.map(p => p.url)}
      blockedDates={blocked.upper}
    />
  );
}
