import Link from 'next/link';
import { getStaticPageMeta } from '@/lib/seo-data';

export const metadata = {
  title: 'Contact - AI90s.site',
  description: getStaticPageMeta('/contact').description,
  alternates: { canonical: 'https://www.ai90s.site/contact' },
  openGraph: {
    title: 'Contact - AI90s.site',
    description: getStaticPageMeta('/contact').description,
    url: 'https://www.ai90s.site/contact',
    siteName: 'AI90s.site',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-slate-900">Contact AI90s.site</h1>
      <p className="mt-5 text-lg text-slate-600">Use the contact page to share feedback, report an issue, or ask a question about a tool, category, or site experience.</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-slate-600">
        <p>Email: hello@ai90s.site</p>
        <p className="mt-2">We respond to useful feedback and support requests as soon as possible.</p>
      </div>
      <div className="mt-8"><Link href="/" className="text-blue-600 hover:underline">Back to home</Link></div>
    </div>
  );
}
