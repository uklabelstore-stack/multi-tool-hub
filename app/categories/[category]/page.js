import Link from 'next/link';
import { getCategories, getCategoryRoute, getCategoryFromSlug, getToolBySlug, getToolMetadata, getCategoryMetadata } from '@/lib/seo-data';
import tools from '@/data/tools';

const categoryNames = getCategories();

export async function generateStaticParams() {
  return categoryNames.map((category) => ({ category: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }));
}

export async function generateMetadata({ params }) {
  const category = getCategoryFromSlug(params.category);
  if (!category) {
    return {
      title: 'Category not found',
      description: 'The requested category could not be found.',
      alternates: { canonical: 'https://www.ai90s.site/' },
    };
  }

  const meta = getCategoryMetadata(category);
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

export default function CategoryPage({ params }) {
  const category = getCategoryFromSlug(params.category);
  if (!category) {
    return <div className="px-4 py-12 text-center text-slate-500">Category not found.</div>;
  }

  const categoryTools = tools.filter((tool) => tool.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <span className="text-slate-700">{category}</span>
        </div>
      </nav>

      <header className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Category</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">{category} tools</h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">Explore practical {category.toLowerCase()} utilities built to help you complete everyday tasks faster, with cleaner workflows and more reliable results.</p>
      </header>

      <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categoryTools.map((tool) => (
          <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-200">
            <div className="mb-3 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">{tool.category}</div>
            <h2 className="text-xl font-bold text-slate-900">{tool.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{tool.desc}</p>
            <div className="mt-4 inline-flex text-sm font-medium text-blue-600">Open tool →</div>
          </Link>
        ))}
      </section>
    </div>
  );
}
