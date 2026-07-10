export const dynamic = 'force-dynamic';
import UnitPage from '@/components/UnitPage';
import { getPhotos, getBlockedDates } from '@/lib/storage';

export default async function LowerUnit() {
  const [photoObjs, blocked] = await Promise.all([
    getPhotos('lower'),
    getBlockedDates(),
  ]);

  return (
    <UnitPage
      unit="lower"
      title="Lower Unit"
      description="A cozy, private retreat with its own entrance. Ideal for families or groups looking for a quiet and comfortable stay. Sleeps up to 4 guests."
      photos={photoObjs.map(p => p.url)}
      blockedDates={blocked.lower}
    />
  );
}
