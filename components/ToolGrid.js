"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';

export default function ToolGrid({ initialTools, categories }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();

    return initialTools.filter((tool) => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const matchesQuery =
        !q ||
        tool.title.toLowerCase().includes(q) ||
        tool.desc.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [initialTools, query, activeCategory]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <input
          aria-label="Search tools"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, categories..."
          className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none ring-0 transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('All')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${activeCategory === 'All' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${activeCategory === category ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="tool-card rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-blue-200"
          >
            <div className="mb-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-blue-700">
              {tool.category}
            </div>
            <h3 className="text-base font-semibold text-slate-900">{tool.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
          </Link>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No tools match your current search.
        </div>
      )}
    </div>
  );
}
