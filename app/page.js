import tools from '@/data/tools';
import ToolGrid from '@/components/ToolGrid';

const categories = Array.from(new Set(tools.map((tool) => tool.category))).sort();

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Multi-Tool Hub',
  url: 'https://www.ai90s.site',
  description: 'Modern online utility tools for productivity, SEO, finance, PDFs, images and developers.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://www.ai90s.site/?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="hero-gradient py-20 relative">
        <div className="relative z-10 container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
              500+ tools
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 md:text-6xl">
              Multi-tool utility suite for everyday work
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
              Fast, useful tools for text, finance, SEO, PDFs, image editing, and developer workflows.
            </p>
          </div>

          <div className="mx-auto mt-8 max-w-4xl">
            <ToolGrid initialTools={tools} categories={categories} />
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Featured tools</h2>
          <span className="text-sm text-slate-500">{tools.length} tools ready</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.slice(0, 6).map((tool) => (
            <a key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card block rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-200">
              <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                {tool.category}
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{tool.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
