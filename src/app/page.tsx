import Link from 'next/link';
import { getFirstPhoto } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [upperPhoto, lowerPhoto] = await Promise.all([
    getFirstPhoto('upper'),
    getFirstPhoto('lower'),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* ── Hero ── */}
      <section className="relative rounded-2xl mb-14 overflow-hidden min-h-[440px] flex items-start">
        {/* Background photo — anchored to the right */}
        <div
          className="absolute inset-0 bg-right bg-no-repeat"
          style={{ backgroundImage: "url('/images/house.jpg')", backgroundSize: '45%' }}
        />
        <div className="absolute inset-0 bg-black/55" />

        {/* Content — left side only */}
        <div className="relative z-10 w-full flex flex-col items-start gap-6 px-10 pt-10 pb-12 max-w-md">

          {/* Title + description */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
              Welcome to<br />Webster House
            </h1>
            <p className="text-base text-stone-200 leading-relaxed drop-shadow">
              Mid-Term Rental &mdash; one month up to a year.<br />
              Quiet and comfortable with AC, laundry,<br />
              and high-speed internet.
            </p>
          </div>

          {/* Unit buttons */}
          <div className="flex flex-col gap-4 w-full">
            <Link
              href="/upper-unit"
              className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-colors shadow-lg text-center"
            >
              Upper Unit
            </Link>
            <Link
              href="/lower-unit"
              className="px-8 py-4 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl font-semibold transition-colors backdrop-blur-sm text-center"
            >
              Lower Unit
            </Link>
          </div>
        </div>
      </section>

      {/* ── Unit cards — description left, cards right ── */}
      <section className="flex flex-col md:flex-row gap-10 mb-14 items-start">

        {/* Left: property description */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">About Webster House</h2>
          <p className="text-stone-600 leading-relaxed mb-4">
            A beautifully maintained 1909 duplex in Portland, Oregon. Both units are fully
            furnished and move-in ready, ideal for travel nurses, remote workers, or anyone
            looking for a comfortable mid-term stay.
          </p>
          <ul className="space-y-2 text-stone-600 text-sm">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              Central air conditioning &amp; heat
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              In-unit laundry
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              High-speed internet
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              Front porch &amp; backyard
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
              Quiet neighborhood, ample street parking
            </li>
          </ul>
        </div>

        {/* Right: unit cards stacked */}
        <div className="flex flex-col gap-5 w-full md:w-72 shrink-0">
          {/* Upper Unit */}
          <Link href="/upper-unit" className="block bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-36 bg-stone-200 overflow-hidden">
              {upperPhoto ? (
                <img src={upperPhoto} alt="Upper unit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-100 to-stone-200 flex items-center justify-center">
                  <span className="text-stone-400 text-xs">No photo yet</span>
                </div>
              )}
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-800">Upper Unit</h3>
                <p className="text-xs text-stone-500 mt-0.5">1 bath · sleeps 3 · from $2,600/mo</p>
              </div>
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          {/* Lower Unit */}
          <Link href="/lower-unit" className="block bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="h-36 bg-stone-200 overflow-hidden">
              {lowerPhoto ? (
                <img src={lowerPhoto} alt="Lower unit" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
                  <span className="text-stone-400 text-xs">No photo yet</span>
                </div>
              )}
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-800">Lower Unit</h3>
                <p className="text-xs text-stone-500 mt-0.5">1.5 baths · sleeps 4 · from $2,650/mo</p>
              </div>
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Reviews teaser ── */}
      <section className="text-center py-10 bg-amber-50 rounded-2xl border border-amber-100">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">What Our Guests Say</h2>
        <p className="text-stone-500 text-sm mb-5">Real reviews from real guests who have stayed with us.</p>
        <Link href="/reviews" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold">
          Read all reviews
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

    </div>
  );
}
