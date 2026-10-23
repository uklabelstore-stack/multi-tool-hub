import Link from 'next/link';
import tools from '@/data/tools';
import { getCategories, getCategoryRoute } from '@/lib/seo-data';

const categories = getCategories();

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">AI</div>
              <div>
                <div className="text-lg font-bold text-white">AI90s.site</div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Utility Studio</div>
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-300">
              AI90s.site brings together practical tools for writing, calculations, finance, SEO, and everyday productivity.
            </p>
            <div className="mt-5 text-xs text-slate-400">© {new Date().getFullYear()} AI90s.site</div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">Company</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              <li><Link href="/about" className="hover:text-white">About</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">Categories</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {categories.slice(0, 6).map((category) => (
                <li key={category}><Link href={getCategoryRoute(category)} className="hover:text-white">{category}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">Popular Tools</h3>
            <ul className="space-y-3 text-sm text-slate-300">
              {['word-counter', 'qr-code-generator', 'password-generator', 'case-converter', 'percentage-calculator'].map((slug) => {
                const tool = tools.find((item) => item.slug === slug);
                if (!tool) return null;
                return <li key={tool.slug}><Link href={`/tools/${tool.slug}`} className="hover:text-white">{tool.title}</Link></li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
