import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="relative text-center py-20 rounded-2xl mb-14 px-8 overflow-hidden min-h-[420px] flex items-center justify-center">
        {/* House photo background */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/house.jpg')", backgroundSize: '60%' }}
        />
        {/* Dark overlay so text stays readable */}
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            Welcome to Webster House
          </h1>
          <p className="text-lg text-stone-200 max-w-xl mx-auto mb-10 drop-shadow">
            Two beautifully furnished units available for short-term stays. Comfortable, private, and ready for your visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upper-unit"
              className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              Upper Unit
            </Link>
            <Link
              href="/lower-unit"
              className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white border border-white/40 rounded-xl font-semibold transition-colors backdrop-blur-sm"
            >
              Lower Unit
            </Link>
          </div>
        </div>
      </section>

      {/* Unit cards */}
      <section className="grid md:grid-cols-2 gap-8 mb-14">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden group hover:shadow-md transition-shadow">
          <div className="h-48 bg-stone-200 overflow-hidden">
            <img src="/images/house.jpg" alt="Webster House exterior" className="w-full h-full object-cover object-top" />
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-2">Upper Unit</h2>
            <p className="text-stone-500 text-sm mb-5 leading-relaxed">
              Bright, spacious, and filled with natural light. Modern kitchen, comfortable bedroom, and a welcoming living area.
            </p>
            <Link href="/upper-unit" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold text-sm">
              View details &amp; availability
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden group hover:shadow-md transition-shadow">
          <div className="h-48 bg-gradient-to-br from-stone-200 to-stone-300 flex items-center justify-center">
            <span className="text-stone-400 font-medium">Lower Unit</span>
          </div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-2">Lower Unit</h2>
            <p className="text-stone-500 text-sm mb-5 leading-relaxed">
              Cozy and private with its own entrance. A perfect retreat for couples or solo travelers seeking a quiet stay.
            </p>
            <Link href="/lower-unit" className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold text-sm">
              View details &amp; availability
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews teaser */}
      <section className="text-center py-10 bg-amber-50 rounded-2xl border border-amber-100">
        <h2 className="text-2xl font-bold text-stone-800 mb-2">What Our Guests Say</h2>
        <p className="text-stone-500 text-sm mb-5">Real reviews from real guests who have stayed with us.</p>
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 font-semibold"
        >
          Read all reviews
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </section>
    </div>
  );
}
