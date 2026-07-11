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
      description="A cozy, private retreat with its own entrance. Ideal for families or groups looking for a quiet and comfortable stay. Central heating and AC. 1.5 baths. Sleeps up to 4 guests."
      basePrice={2650}
      extraPerPerson={150}
      maxGuests={4}
      photos={photoObjs.map(p => p.url)}
      blockedDates={blocked.lower}
    />
  );
}
