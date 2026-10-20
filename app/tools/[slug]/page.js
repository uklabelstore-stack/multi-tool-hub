import tools from '@/data/tools';
import ToolRenderer from '@/components/ToolRenderer';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }) {
  const tool = tools.find((item) => item.slug === params.slug);

  if (!tool) {
    return {
      title: 'Tool not found',
      description: 'The requested tool could not be found.',
      alternates: {
        canonical: '/tools/not-found',
      },
    };
  }

  return {
    title: `${tool.title} - Multi-Tool Hub`,
    description: tool.desc,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: `${tool.title} - Multi-Tool Hub`,
      description: tool.desc,
      url: `https://www.ai90s.site/tools/${tool.slug}`,
    },
  };
}

export default function ToolPage({ params }) {
  const tool = tools.find((item) => item.slug === params.slug);

  if (!tool) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link href="/" className="mb-6 inline-block text-sm font-medium text-blue-600 hover:underline">
        ← Back to all tools
      </Link>
      <div className="mb-6">
        <div className="mb-2 inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">{tool.category}</div>
        <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">{tool.title}</h1>
        <p className="mt-2 text-gray-600">{tool.desc}</p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ToolRenderer slug={tool.slug} html={tool.html} />
      </div>
    </div>
  );
}
