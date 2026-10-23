"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { categoryToSlug } from '@/lib/seo-data';

export default function ToolSearch({ tools, categories }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesQuery =
        !cleanQuery ||
        tool.title.toLowerCase().includes(cleanQuery) ||
        tool.desc.toLowerCase().includes(cleanQuery) ||
        tool.category.toLowerCase().includes(cleanQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, tools]);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-4 shadow-[0_20px_60px_rgba(37,99,235,0.08)] backdrop-blur md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="sr-only" htmlFor="tool-search-input">
          Search tools
        </label>
        <div className="relative flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">⌕</span>
          <input
            id="tool-search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tools, categories, or keywords"
            className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-600 focus:bg-white"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveCategory('All')}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${activeCategory === category ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="tool-card block rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left hover:border-blue-200 hover:bg-white"
          >
            <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
              {tool.category}
            </div>
            <h3 className="text-base font-semibold text-slate-900">{tool.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
            <div className="mt-4 inline-flex items-center text-sm font-medium text-blue-600">
              Open tool <span className="ml-2">→</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No tools match your current search. Try another keyword or category.
        </div>
      )}
    </div>
  );
}
