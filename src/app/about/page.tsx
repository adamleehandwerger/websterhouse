export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">

      <h1 className="text-3xl font-bold text-stone-800 mb-2">About Us</h1>
      <p className="text-stone-500 mb-10">
        We&rsquo;re Adam and Erin, the owners of Webster House.
      </p>

      {/* Bios */}
      <div className="grid md:grid-cols-2 gap-10">

        {/* Adam */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7">
          <h2 className="text-xl font-bold text-stone-800 mb-1">Adam</h2>
          <p className="text-amber-600 text-sm font-medium mb-4">Co-owner &amp; Host</p>
          <p className="text-stone-600 leading-relaxed mb-3">
            Adam has a background in physics and mathematics and is currently looking for
            work at the intersection of physics and machine learning.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed">
            His interests include physics, mathematics, architecture, passive building design,
            military history, music, and hiking.
          </p>
        </div>

        {/* Erin */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7">
          <h2 className="text-xl font-bold text-stone-800 mb-1">Erin</h2>
          <p className="text-amber-600 text-sm font-medium mb-4">Co-owner &amp; Host</p>
          <p className="text-stone-600 leading-relaxed mb-3">
            Erin works in program support for young children at a Montessori school.
          </p>
          <p className="text-stone-500 text-sm leading-relaxed">
            Her interests include art and crafts, cooking, travel, and camping.
          </p>
        </div>

      </div>
    </div>
  );
}
