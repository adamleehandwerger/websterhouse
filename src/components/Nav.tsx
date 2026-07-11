'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  { href: '/upper-unit', label: 'Upper Unit' },
  { href: '/lower-unit', label: 'Lower Unit' },
  { href: '/reviews', label: 'Reviews' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 shadow-sm" style={{ backgroundColor: '#C09189' }}>
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="text-xl font-bold tracking-wide transition-opacity hover:opacity-80" style={{ color: '#494B39' }}>
          Webster House
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: '#494B39', opacity: path === href ? 1 : 0.75 }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 transition-opacity hover:opacity-70"
          style={{ color: '#494B39' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-3" style={{ backgroundColor: '#C09189', borderColor: '#b08078' }}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium py-1 transition-opacity hover:opacity-70"
              style={{ color: '#494B39', opacity: path === href ? 1 : 0.75 }}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
