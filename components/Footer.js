import Link from 'next/link';
import tools from '@/data/tools';

const categories = Array.from(new Set(tools.map((tool) => tool.category))).sort();

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                MT
              </div>
              <h3 className="text-lg font-bold text-slate-900">Multi-Tool Hub</h3>
            </div>
            <p className="max-w-sm text-sm text-slate-600">
              A modern hub of utility tools built for text, finance, SEO, images, PDFs, and developer workflows.
            </p>
            <p className="mt-4 text-xs text-slate-500">© {new Date().getFullYear()} Multi-Tool Hub</p>
          </div>

          {categories.slice(0, 4).map((category) => {
            const categoryTools = tools.filter((tool) => tool.category === category).slice(0, 5);

            return (
              <div key={category}>
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">{category}</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {categoryTools.map((tool) => (
                    <li key={tool.slug}>
                      <Link href={`/tools/${tool.slug}`} className="hover:text-blue-600 hover:underline">
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
