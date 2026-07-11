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
      description="Bright and spacious with an open floor plan, fully equipped kitchen, and comfortable furnishings throughout. Mini-split heating and cooling. 1 bath. Sleeps up to 3 guests."
      basePrice={2600}
      extraPerPerson={100}
      maxGuests={3}
      photos={photoObjs.map(p => p.url)}
      blockedDates={blocked.upper}
    />
  );
}
