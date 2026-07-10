'use client';
import { useState } from 'react';

interface CalendarProps {
  blockedDates: string[];
  startDate: string | null;
  endDate: string | null;
  onStartChange: (date: string | null) => void;
  onEndChange: (date: string | null) => void;
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function toISO(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
}

export function formatDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return `${String(m).padStart(2,'0')}/${String(d).padStart(2,'0')}/${y}`;
}

export function parseInput(val: string): string | null {
  const match = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, m, d, y] = match;
  const iso = `${y}-${m}-${d}`;
  if (isNaN(new Date(iso).getTime())) return null;
  return iso;
}

export default function Calendar({
  blockedDates, startDate, endDate, onStartChange, onEndChange,
}: CalendarProps) {
  const today = new Date();
  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleClick = (iso: string) => {
    if (blockedDates.includes(iso) || iso < todayISO) return;

    if (iso === startDate) {
      // Clicking start again removes it; promote end to start if exists
      onStartChange(endDate);
      onEndChange(null);
    } else if (iso === endDate) {
      onEndChange(null);
    } else if (!startDate) {
      onStartChange(iso);
    } else if (!endDate) {
      if (iso < startDate) {
        // Clicked before current start — swap
        onEndChange(startDate);
        onStartChange(iso);
      } else {
        onEndChange(iso);
      }
    } else {
      // Both already set — reset with new date as start
      onStartChange(iso);
      onEndChange(null);
    }
  };

  // Compute next available date for the "Next available:" display
  const nextAvailable = (() => {
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = toISO(d.getFullYear(), d.getMonth(), d.getDate());
      if (!blockedDates.includes(iso)) return iso;
    }
    return null;
  })();

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isInRange = (iso: string) =>
    !!(startDate && endDate && iso > startDate && iso < endDate);

  return (
    <div>
      {nextAvailable && (
        <p className="text-sm text-stone-500 mb-3">
          Next available:{' '}
          <span className="font-semibold text-amber-700">
            {MONTHS[parseInt(nextAvailable.split('-')[1]) - 1]}{' '}
            {parseInt(nextAvailable.split('-')[2])},{' '}
            {nextAvailable.split('-')[0]}
          </span>
        </p>
      )}

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded hover:bg-stone-100 transition-colors" aria-label="Previous month">
          <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="font-semibold text-stone-800">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded hover:bg-stone-100 transition-colors" aria-label="Next month">
          <svg className="w-5 h-5 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center text-xs font-medium text-stone-400 mb-1">
        {DAYS.map(d => <div key={d} className="py-1">{d}</div>)}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;

          const iso = toISO(viewYear, viewMonth, day);
          const isBlocked = blockedDates.includes(iso);
          const isPast = iso < todayISO;
          const isStart = iso === startDate;
          const isEnd = iso === endDate;
          const inRange = isInRange(iso);
          const isToday = iso === todayISO;
          const disabled = isBlocked || isPast;

          let cls = 'relative w-full flex flex-col items-center justify-center rounded-lg text-sm transition-all select-none ';
          cls += 'aspect-square '; // square cells

          if (isStart) {
            cls += 'bg-green-500 text-white font-semibold cursor-pointer ';
          } else if (isEnd) {
            cls += 'bg-blue-500 text-white font-semibold cursor-pointer ';
          } else if (inRange) {
            cls += 'bg-green-100 text-green-800 cursor-pointer ';
          } else if (isBlocked) {
            cls += 'bg-red-100 text-red-300 cursor-not-allowed line-through ';
          } else if (isPast) {
            cls += 'text-stone-300 cursor-not-allowed ';
          } else if (isToday) {
            cls += 'border-2 border-amber-400 text-amber-700 font-semibold cursor-pointer hover:bg-amber-50 ';
          } else {
            cls += 'hover:bg-stone-100 text-stone-700 cursor-pointer ';
          }

          return (
            <button
              key={iso}
              onClick={() => handleClick(iso)}
              disabled={disabled}
              className={cls}
              title={isBlocked ? 'Not available' : isPast ? 'Past date' : undefined}
            >
              <span>{day}</span>
              {(isStart || isEnd) && (
                <span className="text-[8px] leading-none mt-0.5 font-normal opacity-90">
                  {isStart ? 'Start' : 'End'}
                </span>
              )}
              {(isStart || isEnd) && (
                <span className="absolute -top-1 -right-1 bg-white text-stone-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] shadow border border-stone-200 font-bold leading-none">
                  ✕
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 text-xs text-stone-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-500 inline-block" /> Start date
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500 inline-block" /> End date
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" /> Unavailable
        </span>
      </div>
    </div>
  );
}
