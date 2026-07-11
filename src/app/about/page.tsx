export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-stone-800 mb-2">About Us</h1>
      <p className="text-stone-500 mb-10">
        We&rsquo;re the owners of Webster House &mdash; a 1909 Portland duplex we&rsquo;ve lovingly
        maintained and made available for mid-term stays.
      </p>

      {/* Photo */}
      <div className="rounded-2xl overflow-hidden mb-12 shadow-md">
        <img
          src="/images/adam-erin.jpg"
          alt="Adam and Erin"
          className="w-full object-cover max-h-[480px] object-top"
        />
      </div>

      {/* Bios */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* Adam */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7">
          <h2 className="text-xl font-bold text-stone-800 mb-1">Adam</h2>
          <p className="text-amber-600 text-sm font-medium mb-4">Co-owner &amp; Host</p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Adam has a background in physics and mathematics and is currently exploring the
            intersection of physics and machine learning. He brings a detail-oriented,
            analytical eye to everything he touches &mdash; including keeping Webster House
            in great shape.
          </p>
          <ul className="space-y-1.5 text-stone-500 text-sm">
            {[
              'Physics & mathematics',
              'Architecture & passive building design',
              'Military history',
              'Music',
              'Hiking',
            ].map(interest => (
              <li key={interest} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {interest}
              </li>
            ))}
          </ul>
        </div>

        {/* Erin */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7">
          <h2 className="text-xl font-bold text-stone-800 mb-1">Erin</h2>
          <p className="text-amber-600 text-sm font-medium mb-4">Co-owner &amp; Host</p>
          <p className="text-stone-600 leading-relaxed mb-4">
            Erin works as a program support specialist for young children at a Montessori
            school, where her patience and creativity shine every day. She brings that same
            warmth to making guests feel right at home at Webster House.
          </p>
          <ul className="space-y-1.5 text-stone-500 text-sm">
            {[
              'Art & crafts',
              'Cooking',
              'Travel',
              'Camping',
            ].map(interest => (
              <li key={interest} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                {interest}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
