'use client';
import { useState } from 'react';
import PhotoGallery from './PhotoGallery';
import Calendar, { formatDisplay, parseInput } from './Calendar';

interface UnitPageProps {
  unit: 'upper' | 'lower';
  title: string;
  description: string;
  basePrice: number;
  extraPerPerson: number;
  maxGuests: number;
  photos: string[];
  blockedDates: string[];
}

type Step = 'browsing' | 'done';

export default function UnitPage({ unit, title, description, basePrice, extraPerPerson, maxGuests, photos, blockedDates }: UnitPageProps) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<Step>('browsing');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Calendar → manual input sync
  const handleStartChange = (date: string | null) => {
    setStartDate(date);
    setStartInput(date ? formatDisplay(date) : '');
  };
  const handleEndChange = (date: string | null) => {
    setEndDate(date);
    setEndInput(date ? formatDisplay(date) : '');
  };

  // Manual input → calendar sync
  const handleStartInput = (val: string) => {
    setStartInput(val);
    const iso = parseInput(val);
    if (iso) setStartDate(iso);
    else if (!val) setStartDate(null);
  };
  const handleEndInput = (val: string) => {
    setEndInput(val);
    const iso = parseInput(val);
    if (iso) setEndDate(iso);
    else if (!val) setEndDate(null);
  };

  const handleSubmit = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unit, startDate, endDate, phone: phone.trim() }),
      });
      if (!res.ok) throw new Error();
      setStep('done');
    } catch {
      setError('Something went wrong. Please try again or call/text us directly at (503) 944-9019.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-stone-800 mb-3">Thanks for your interest!</h2>
        <p className="text-stone-600 text-lg">
          We will call or text you back as soon as possible.
        </p>
        {startDate && (
          <p className="text-sm text-stone-400 mt-4">
            Requested: {formatDisplay(startDate)}{endDate ? ` – ${formatDisplay(endDate)}` : ''}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-stone-800 mb-2">{title}</h1>
          <p className="text-stone-500 max-w-2xl">{description}</p>
        </div>

        {/* Pricing card */}
        <div className="shrink-0 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 min-w-[200px]">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-2">Pricing</p>
          <p className="text-2xl font-bold text-stone-800">
            ${basePrice.toLocaleString()}<span className="text-sm font-normal text-stone-500">/mo</span>
          </p>
          <p className="text-sm text-stone-500 mt-1">1 person</p>
          <div className="border-t border-amber-200 mt-3 pt-3">
            <p className="text-sm text-stone-600">
              +${extraPerPerson}/mo per additional guest
            </p>
            <p className="text-xs text-stone-400 mt-0.5">Up to {maxGuests} guests total</p>
          </div>
        </div>
      </div>

      {/* Photos */}
      <section className="mb-12">
        <h2 className="text-lg font-semibold text-stone-700 mb-4">Photos</h2>
        <PhotoGallery photos={photos} />
      </section>

      {/* Calendar + Inquiry together */}
      <section>
        <h2 className="text-lg font-semibold text-stone-700 mb-1">Check Availability</h2>
        <p className="text-stone-500 text-sm mb-5">
          Which time period are you interested in staying?
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Calendar */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 w-full max-w-sm">
            <Calendar
              blockedDates={blockedDates}
              startDate={startDate}
              endDate={endDate}
              onStartChange={handleStartChange}
              onEndChange={handleEndChange}
            />
          </div>

          {/* Inquiry form */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 w-full max-w-sm">
            <h3 className="font-semibold text-stone-800 mb-4">Request Information</h3>

            <div className="space-y-4 mb-5">
              {/* Date inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startInput}
                    onChange={e => handleStartInput(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={endInput}
                    onChange={e => handleEndInput(e.target.value)}
                    placeholder="MM/DD/YYYY"
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Your Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="(503) 555-1234"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs mb-3">{error}</p>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              {submitting ? 'Sending...' : 'Submit Inquiry'}
            </button>

            <p className="text-xs text-stone-400 mt-3 text-center">
              We&apos;ll reach out by call or text — usually same day.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
