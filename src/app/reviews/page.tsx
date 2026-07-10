import { getReviews } from '@/lib/storage';

export default async function Reviews() {
  const reviews = await getReviews();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-stone-800 mb-2">Guest Reviews</h1>
      <p className="text-stone-500 mb-10">Hear what our guests have to say about staying at Webster House.</p>

      {reviews.length === 0 ? (
        <div className="text-center py-24 bg-stone-100 rounded-2xl">
          <p className="text-stone-400 text-lg font-medium">Reviews coming soon!</p>
          <p className="text-stone-400 text-sm mt-2">Check back after our first guests check in.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(url => (
            <div key={url} className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <img src={url} alt="Guest review" className="w-full object-contain" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
