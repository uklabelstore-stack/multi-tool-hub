import Link from 'next/link';
import tools from '@/data/tools';
import { getCategories, getCategoryRoute } from '@/lib/seo-data';

const categories = getCategories();

export default function ToolGrid({ initialTools, categories: categoryList }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {initialTools.map((tool) => (
        <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200 hover:bg-slate-50">
          <span className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">{tool.category}</span>
          <h3 className="text-xl font-semibold text-slate-900">{tool.title}</h3>
          <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
        </Link>
      ))}
    </div>
  );
}
