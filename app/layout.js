import tools from '@/data/tools';
import Link from 'next/link';
import { getCategories, getCategoryRoute } from '@/lib/seo-data';

const categories = getCategories();

export const metadata = {
  metadataBase: new URL('https://www.ai90s.site'),
  title: 'AI90s.site | Online Utility Tools',
  description: 'AI90s.site brings together fast, practical tools for writing, calculations, finance, images, PDFs, SEO, and everyday productivity.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'AI90s.site | Online Utility Tools',
    description: 'AI90s.site brings together fast, practical tools for writing, calculations, finance, images, PDFs, SEO, and everyday productivity.',
    url: 'https://www.ai90s.site/',
    siteName: 'AI90s.site',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3" aria-label="AI90s.site home page">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-200">AI</div>
                <div>
                  <div className="text-lg font-black tracking-tight text-slate-900">AI90s.site</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Utility Hub</div>
                </div>
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                <Link href="/" className="text-sm font-medium text-slate-700 hover:text-blue-600">Home</Link>
                <div className="group relative">
                  <button type="button" className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-blue-600" aria-label="Open categories menu">
                    Categories <span aria-hidden="true">▾</span>
                  </button>
                  <div className="invisible absolute left-0 top-full z-20 mt-3 min-w-[230px] rounded-2xl border border-slate-200 bg-white p-3 opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100">
                    <div className="grid gap-1">
                      {categories.map((category) => (
                        <Link key={category} href={getCategoryRoute(category)} className="rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-blue-600">{category}</Link>
                      ))}
                    </div>
                  </div>
                </div>
                <Link href="/#popular-tools" className="text-sm font-medium text-slate-700 hover:text-blue-600">Popular</Link>
                <Link href="/#browse-categories" className="text-sm font-medium text-slate-700 hover:text-blue-600">Browse</Link>
                <Link href="/about" className="text-sm font-medium text-slate-700 hover:text-blue-600">About</Link>
              </nav>

              <Link href="#tool-search" className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-200 hover:text-blue-600 md:inline-flex">Explore tools</Link>
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-slate-950 text-slate-200">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-lg font-black text-white">AI</div>
                  <div>
                    <div className="text-lg font-bold text-white">AI90s.site</div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">Utility Studio</div>
                  </div>
                </div>
                <p className="max-w-md text-sm leading-6 text-slate-300">AI90s.site collects practical tools for writing, calculations, finance, SEO, PDFs, images, and everyday productivity.</p>
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
      </body>
    </html>
  );
}
