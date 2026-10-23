import Link from 'next/link';
import { getStaticPageMeta } from '@/lib/seo-data';

export const metadata = {
  title: 'About - AI90s.site',
  description: getStaticPageMeta('/about').description,
  alternates: { canonical: 'https://www.ai90s.site/about' },
  openGraph: {
    title: 'About - AI90s.site',
    description: getStaticPageMeta('/about').description,
    url: 'https://www.ai90s.site/about',
    siteName: 'AI90s.site',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-slate-900">About AI90s.site</h1>
      <p className="mt-5 text-lg text-slate-600">AI90s.site brings together practical utility tools for writing, calculation, SEO, PDF tasks, images, and productivity. The site is designed to feel fast, clear, and easy to use on any device.</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Each tool is built for a specific task and keeps the workflow simple. We focus on clarity, accuracy, useful examples, and responsive interfaces so users can solve everyday problems without confusion.</p>
      </div>
      <div className="mt-8"><Link href="/" className="text-blue-600 hover:underline">Back to home</Link></div>
    </div>
  );
}
