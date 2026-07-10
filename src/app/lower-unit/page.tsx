import UnitPage from '@/components/UnitPage';
import { getPhotos, getBlockedDates } from '@/lib/storage';

export default async function LowerUnit() {
  const [photos, blocked] = await Promise.all([
    getPhotos('lower'),
    getBlockedDates(),
  ]);

  return (
    <UnitPage
      unit="lower"
      title="Lower Unit"
      description="A cozy, private retreat with its own entrance. Ideal for couples or solo travelers looking for a quiet and comfortable stay."
      photos={photos}
      blockedDates={blocked.lower}
    />
  );
}
