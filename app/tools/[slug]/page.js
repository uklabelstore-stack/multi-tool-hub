import Link from 'next/link';
import { notFound } from 'next/navigation';
import ToolRenderer from '@/components/ToolRenderer';
import tools from '@/data/tools';
import { getCategories, getCategoryRoute, getCategoryFromSlug, getToolBySlug, getToolMetadata, getCategoryMetadata, getCategoryRoute as getCategoryPath } from '@/lib/seo-data';

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) {
    return {
      title: 'Tool not found',
      description: 'The requested tool could not be found.',
      alternates: { canonical: 'https://www.ai90s.site/' },
    };
  }

  const meta = getToolMetadata(tool);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: meta.canonical,
      siteName: 'AI90s.site',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.ogTitle,
      description: meta.ogDescription,
    },
  };
}

export default function ToolPage({ params }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) return notFound();

  const relatedTools = tools.filter((item) => item.category === tool.category && item.slug !== tool.slug).slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href={getCategoryRoute(tool.category)} className="hover:text-blue-600">{tool.category}</Link>
          <span>/</span>
          <span className="text-slate-700">{tool.title}</span>
        </div>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <div className="mb-4 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">{tool.category}</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">{tool.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">{tool.desc}</p>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <ToolRenderer slug={tool.slug} html={tool.html} />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">How it works</h2>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-3"><span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span><span>Enter your source material or key details.</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span><span>Review the output instantly in the tool interface.</span></li>
              <li className="flex gap-3"><span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span><span>Use the clear, practical result for your next step.</span></li>
            </ol>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Examples</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>• Try a standard value first to confirm the expected workflow.</li>
              <li>• Check a negative or edge-case input to review validation handling.</li>
              <li>• Reset the form to test repeated usage without reloading the page.</li>
            </ul>
          </div>
        </aside>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
          <div className="mt-5 space-y-5">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-semibold text-slate-900">What is this tool for?</h3>
              <p className="mt-2 text-sm text-slate-600">This utility helps you complete {tool.category.toLowerCase()} tasks faster and with clearer results for everyday online work.</p>
            </div>
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-base font-semibold text-slate-900">Does it work well on mobile?</h3>
              <p className="mt-2 text-sm text-slate-600">Yes. The interface is responsive and designed to remain usable across phones, tablets, and desktop screens.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Can I use it repeatedly?</h3>
              <p className="mt-2 text-sm text-slate-600">Yes. You can clear the form, try new values, and reuse the tool whenever needed without leaving the page.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Related tools</h2>
          <div className="mt-5 space-y-3">
            {relatedTools.length > 0 ? relatedTools.map((related) => (
              <Link key={related.slug} href={`/tools/${related.slug}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 hover:border-blue-200 hover:bg-white">
                <span>{related.title}</span>
                <span className="text-blue-600">→</span>
              </Link>
            )) : <p className="text-sm text-slate-500">No related tools available in this category.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}
