import UnitPage from '@/components/UnitPage';
import { getPhotos, getBlockedDates } from '@/lib/storage';

export default async function UpperUnit() {
  const [photos, blocked] = await Promise.all([
    getPhotos('upper'),
    getBlockedDates(),
  ]);

  return (
    <UnitPage
      unit="upper"
      title="Upper Unit"
      description="Bright and spacious with an open floor plan, fully equipped kitchen, and comfortable furnishings throughout. Sleeps up to 4 guests."
      photos={photos}
      blockedDates={blocked.upper}
    />
  );
}
