'use client';
import { useState, useEffect, useRef } from 'react';

/* ────────────────────────────────────────────────────────────
   Inline admin calendar — click to toggle a date blocked/open
──────────────────────────────────────────────────────────── */
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

function datesInRange(a: string, b: string): string[] {
  const start = new Date(a < b ? a : b);
  const end   = new Date(a < b ? b : a);
  const out: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    out.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

function AdminCalendar({
  blockedDates,
  onToggle,
  onBlockRange,
  onUnblockRange,
}: {
  blockedDates: string[];
  onToggle: (date: string) => void;
  onBlockRange: (dates: string[]) => void;
  onUnblockRange: (dates: string[]) => void;
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const previewDates = rangeStart && hoverDate ? new Set(datesInRange(rangeStart, hoverDate)) : null;

  const handleClick = (iso: string) => {
    if (!rangeStart) {
      setRangeStart(iso);
      return;
    }
    if (rangeStart === iso) {
      setRangeStart(null);
      return;
    }
    const range = datesInRange(rangeStart, iso);
    // If majority of range is already blocked, unblock it; otherwise block it
    const blockedCount = range.filter(d => blockedDates.includes(d)).length;
    if (blockedCount > range.length / 2) {
      onUnblockRange(range);
    } else {
      onBlockRange(range);
    }
    setRangeStart(null);
    setHoverDate(null);
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded hover:bg-stone-100" aria-label="Prev">
          <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-stone-800 text-sm">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded hover:bg-stone-100" aria-label="Next">
          <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {rangeStart && (
        <div className="mb-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700 flex items-center justify-between">
          <span>Start: <strong>{rangeStart}</strong> — now click an end date</span>
          <button onClick={() => { setRangeStart(null); setHoverDate(null); }} className="ml-2 text-amber-500 hover:text-amber-700 font-bold">✕</button>
        </div>
      )}

      <div className="grid grid-cols-7 text-center text-xs font-medium text-stone-400 mb-1">
        {DAYS.map(d => <div key={d} className="py-1">{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`b-${i}`} />;
          const iso = toISO(viewYear, viewMonth, day);
          const isBlocked = blockedDates.includes(iso);
          const isStart = iso === rangeStart;
          const inPreview = previewDates?.has(iso) ?? false;

          let cls = 'w-full aspect-square rounded-lg text-sm font-medium transition-all ';
          if (isStart) {
            cls += 'bg-amber-500 text-white ring-2 ring-amber-300';
          } else if (inPreview && isBlocked) {
            cls += 'bg-red-200 text-red-800';
          } else if (inPreview) {
            cls += 'bg-amber-200 text-amber-900';
          } else if (isBlocked) {
            cls += 'bg-red-400 text-white hover:bg-red-500';
          } else {
            cls += 'hover:bg-stone-100 text-stone-700';
          }

          return (
            <button
              key={iso}
              onClick={() => handleClick(iso)}
              onMouseEnter={() => rangeStart && setHoverDate(iso)}
              onMouseLeave={() => setHoverDate(null)}
              title={isStart ? 'Start selected — click end date' : isBlocked ? 'Blocked — click to include in range' : 'Click to set as start or end'}
              className={cls}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-stone-400 mt-3">
        {rangeStart
          ? 'Click any date to block/unblock the whole range.'
          : 'Click a date to start a range. Single click toggles one date.'}
      </p>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Login form
──────────────────────────────────────────────────────────── */
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) {
      sessionStorage.setItem('wh_admin', '1');
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-24 px-4">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
        <h1 className="text-xl font-bold text-stone-800 mb-6 text-center">Admin Login</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-stone-300 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 text-white py-2.5 rounded-xl font-semibold transition-colors"
          >
            {loading ? 'Checking...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Image compression helper — resizes to max 1920px, JPEG 85%
──────────────────────────────────────────────────────────── */
function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

/* ────────────────────────────────────────────────────────────
   Main admin panel
──────────────────────────────────────────────────────────── */
type Tab = 'photos' | 'calendar' | 'reviews';

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  type Photo = { url: string; publicId: string };
  const [tab, setTab] = useState<Tab>('photos');
  const [upperPhotos, setUpperPhotos] = useState<Photo[]>([]);
  const [lowerPhotos, setLowerPhotos] = useState<Photo[]>([]);
  const [reviews, setReviews] = useState<Photo[]>([]);
  const [blocked, setBlocked] = useState<{ upper: string[]; lower: string[] }>({ upper: [], lower: [] });
  const [photoUnit, setPhotoUnit] = useState<'upper' | 'lower'>('upper');
  const [calUnit, setCalUnit] = useState<'upper' | 'lower'>('upper');
  const [toast, setToast] = useState('');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const reviewInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // ── Fetch helpers ──
  const fetchPhotos = async (unit: 'upper' | 'lower') => {
    const r = await fetch(`/api/photos/${unit}`);
    const d = await r.json();
    if (unit === 'upper') setUpperPhotos(d.photos ?? []);
    else setLowerPhotos(d.photos ?? []);
  };

  const fetchReviews = async () => {
    const r = await fetch('/api/reviews');
    const d = await r.json();
    setReviews(d.reviews ?? []);
  };

  const fetchBlocked = async () => {
    const r = await fetch('/api/admin/blocked-dates');
    setBlocked(await r.json());
  };

  useEffect(() => {
    fetchPhotos('upper');
    fetchPhotos('lower');
    fetchReviews();
    fetchBlocked();
  }, []);

  // ── Photo upload (direct to Cloudinary to bypass Vercel's 4.5 MB body limit) ──
  const uploadPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const sigRes = await fetch(`/api/admin/upload-signature?unit=${photoUnit}`);
    if (!sigRes.ok) { showToast('Upload failed: could not get signature'); return; }
    const { signature, timestamp, api_key, cloud_name, folder } = await sigRes.json();

    for (const file of Array.from(files)) {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append('file', compressed);
      form.append('api_key', api_key);
      form.append('signature', signature);
      form.append('timestamp', String(timestamp));
      form.append('folder', folder);

      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: form }
      );
      if (!up.ok) {
        const err = await up.json().catch(() => ({}));
        showToast(`Upload failed: ${err.error?.message ?? up.status}`);
        if (photoInputRef.current) photoInputRef.current.value = '';
        return;
      }
    }

    showToast('Photos uploaded!');
    fetchPhotos(photoUnit);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const deletePhoto = async (publicId: string, unit: 'upper' | 'lower') => {
    const r = await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });
    if (r.ok) { showToast('Photo deleted.'); fetchPhotos(unit); }
  };

  // ── Review upload (direct to Cloudinary) ──
  const uploadReviews = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const sigRes = await fetch('/api/admin/upload-signature?unit=reviews');
    if (!sigRes.ok) { showToast('Upload failed: could not get signature'); return; }
    const { signature, timestamp, api_key, cloud_name, folder } = await sigRes.json();

    for (const file of Array.from(files)) {
      if (!file.name.toLowerCase().endsWith('.png')) continue;
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append('file', compressed);
      form.append('api_key', api_key);
      form.append('signature', signature);
      form.append('timestamp', String(timestamp));
      form.append('folder', folder);

      const up = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
        { method: 'POST', body: form }
      );
      if (!up.ok) {
        const err = await up.json().catch(() => ({}));
        showToast(`Upload failed: ${err.error?.message ?? up.status}`);
        if (reviewInputRef.current) reviewInputRef.current.value = '';
        return;
      }
    }

    showToast('Review uploaded!');
    fetchReviews();
    if (reviewInputRef.current) reviewInputRef.current.value = '';
  };

  const deleteReview = async (publicId: string) => {
    const r = await fetch('/api/admin/reviews', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });
    if (r.ok) { showToast('Review deleted.'); fetchReviews(); }
  };

  // ── Drag-and-drop reorder ──
  const handleDrop = async (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) { setDragIdx(null); setDropIdx(null); return; }
    const photos = [...(photoUnit === 'upper' ? upperPhotos : lowerPhotos)];
    const [moved] = photos.splice(dragIdx, 1);
    photos.splice(targetIdx, 0, moved);
    if (photoUnit === 'upper') setUpperPhotos(photos);
    else setLowerPhotos(photos);
    setDragIdx(null);
    setDropIdx(null);
    await fetch('/api/admin/photo-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit: photoUnit, order: photos.map(p => p.publicId) }),
    });
  };

  // ── Calendar toggle / range ──
  const toggleDate = async (date: string) => {
    const action = blocked[calUnit].includes(date) ? 'remove' : 'add';
    await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit: calUnit, date, action }),
    });
    fetchBlocked();
  };

  const blockRange = async (dates: string[]) => {
    await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit: calUnit, dates, action: 'add' }),
    });
    fetchBlocked();
  };

  const unblockRange = async (dates: string[]) => {
    await fetch('/api/admin/blocked-dates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unit: calUnit, dates, action: 'remove' }),
    });
    fetchBlocked();
  };

  const activePhotos = photoUnit === 'upper' ? upperPhotos : lowerPhotos;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold text-stone-800">Webster House — Admin</h1>
        <button
          onClick={onLogout}
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 text-sm">
          {toast}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200 mb-7">
        {(['photos', 'calendar', 'reviews'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors -mb-px ${
              tab === t
                ? 'border-b-2 border-amber-500 text-amber-700'
                : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ─── Photos tab ─── */}
      {tab === 'photos' && (
        <div>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {/* Unit toggle */}
            <div className="flex rounded-xl border border-stone-200 overflow-hidden">
              {(['upper', 'lower'] as const).map(u => (
                <button
                  key={u}
                  onClick={() => setPhotoUnit(u)}
                  className={`px-4 py-2 text-sm capitalize font-medium transition-colors ${
                    photoUnit === u ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {u} Unit
                </button>
              ))}
            </div>

            {/* Upload button */}
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Photos
              <input
                ref={photoInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={uploadPhotos}
                className="hidden"
              />
            </label>
          </div>

          <p className="text-sm text-stone-500 mb-3 capitalize">
            {photoUnit} Unit — {activePhotos.length} photo{activePhotos.length !== 1 ? 's' : ''}
          </p>

          {activePhotos.length === 0 ? (
            <p className="text-stone-400 text-sm py-8 text-center border border-dashed border-stone-200 rounded-xl">
              No photos yet. Click &quot;Upload Photos&quot; to add some.
            </p>
          ) : (
            <>
            <p className="text-xs text-stone-400 mb-2">Drag photos to reorder.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {activePhotos.map((photo, i) => (
                <div
                  key={photo.publicId}
                  draggable
                  onDragStart={() => { setDragIdx(i); setDropIdx(null); }}
                  onDragOver={e => { e.preventDefault(); setDropIdx(i); }}
                  onDragLeave={() => setDropIdx(null)}
                  onDrop={() => handleDrop(i)}
                  onDragEnd={() => { setDragIdx(null); setDropIdx(null); }}
                  className={`relative group aspect-video rounded-xl overflow-hidden border transition-all cursor-grab active:cursor-grabbing
                    ${dragIdx === i ? 'opacity-40 scale-95' : ''}
                    ${dropIdx === i && dragIdx !== i ? 'border-amber-400 border-2 scale-105' : 'border-stone-200'}
                  `}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover pointer-events-none" />
                  <button
                    onClick={() => deletePhoto(photo.publicId, photoUnit)}
                    className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Delete photo"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            </>
          )}
        </div>
      )}

      {/* ─── Calendar tab ─── */}
      {tab === 'calendar' && (
        <div>
          <div className="flex rounded-xl border border-stone-200 overflow-hidden w-fit mb-6">
            {(['upper', 'lower'] as const).map(u => (
              <button
                key={u}
                onClick={() => setCalUnit(u)}
                className={`px-4 py-2 text-sm capitalize font-medium transition-colors ${
                  calUnit === u ? 'bg-stone-800 text-white' : 'bg-white text-stone-500 hover:bg-stone-50'
                }`}
              >
                {u} Unit
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 w-full max-w-xs">
              <AdminCalendar
                blockedDates={blocked[calUnit]}
                onToggle={toggleDate}
                onBlockRange={blockRange}
                onUnblockRange={unblockRange}
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium text-stone-700 mb-3">
                Blocked dates — {calUnit} unit ({blocked[calUnit].length})
              </p>
              {blocked[calUnit].length === 0 ? (
                <p className="text-stone-400 text-sm">No dates blocked.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {[...blocked[calUnit]].sort().map(d => (
                    <button
                      key={d}
                      onClick={() => toggleDate(d)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-full text-sm transition-colors"
                      title="Click to unblock"
                    >
                      {d} ✕
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Reviews tab ─── */}
      {tab === 'reviews' && (
        <div>
          <div className="mb-6">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Review (PNG)
              <input
                ref={reviewInputRef}
                type="file"
                multiple
                accept=".png,image/png"
                onChange={uploadReviews}
                className="hidden"
              />
            </label>
            <p className="text-xs text-stone-400 mt-2">Only .png files are accepted.</p>
          </div>

          {reviews.length === 0 ? (
            <p className="text-stone-400 text-sm py-8 text-center border border-dashed border-stone-200 rounded-xl">
              No reviews uploaded yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.map(review => (
                <div key={review.publicId} className="relative group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                  <img src={review.url} alt="Review" className="w-full object-contain" />
                  <button
                    onClick={() => deleteReview(review.publicId)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    title="Delete review"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Page root — handles auth state
──────────────────────────────────────────────────────────── */
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem('wh_admin') === '1');
  }, []);

  const logout = () => {
    sessionStorage.removeItem('wh_admin');
    setAuthed(false);
  };

  if (authed === null) return null; // avoid hydration flash

  return authed
    ? <AdminPanel onLogout={logout} />
    : <LoginForm onSuccess={() => setAuthed(true)} />;
}
