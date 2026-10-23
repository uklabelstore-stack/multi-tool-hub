"use client";

import Link from 'next/link';
import { useState } from 'react';
import tools from '@/data/tools';
import { categoryToSlug } from '@/lib/seo-data';

const categories = Array.from(new Set(tools.map((tool) => tool.category))).sort((a, b) => a.localeCompare(b));

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="AI90s.site home page">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200">
            AI
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900">AI90s.site</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Utility Hub</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">Home</Link>
          <div className="group relative">
            <button type="button" className="flex items-center gap-1 text-sm font-medium text-slate-700 transition hover:text-blue-600" aria-label="Open categories menu">
              Categories
              <span aria-hidden="true">▾</span>
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-3 min-w-[220px] rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="grid gap-1">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${categoryToSlug(category)}`}
                    className="rounded-xl px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 hover:text-blue-600"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link href="/#popular-tools" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">Popular</Link>
          <Link href="/#browse-categories" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">Browse</Link>
          <Link href="/about" className="text-sm font-medium text-slate-700 transition hover:text-blue-600">About</Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="#tool-search" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600">
            Explore tools
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-lg text-slate-700 md:hidden"
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
          onClick={() => setMobileOpen((value) => !value)}
        >
          ☰
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 md:hidden">
          <div className="space-y-3 text-sm text-slate-700">
            <Link href="/" className="block rounded-xl px-2 py-2 hover:bg-slate-100">Home</Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/categories/${categoryToSlug(category)}`}
                className="block rounded-xl px-2 py-2 hover:bg-slate-100"
              >
                {category}
              </Link>
            ))}
            <Link href="/about" className="block rounded-xl px-2 py-2 hover:bg-slate-100">About</Link>
          </div>
        </div>
      )}
    </div>
  );
}
