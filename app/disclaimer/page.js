import Link from 'next/link';
import { getStaticPageMeta } from '@/lib/seo-data';

export const metadata = {
  title: 'Terms - AI90s.site',
  description: getStaticPageMeta('/terms').description,
  alternates: { canonical: 'https://www.ai90s.site/terms' },
  openGraph: {
    title: 'Terms - AI90s.site',
    description: getStaticPageMeta('/terms').description,
    url: 'https://www.ai90s.site/terms',
    siteName: 'AI90s.site',
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-slate-900">Terms of Use</h1>
      <p className="mt-5 text-lg text-slate-600">AI90s.site provides online tools for general productivity and convenience. By using the site, you agree to use these tools responsibly and for lawful, everyday tasks.</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">The services are provided without guarantees of perfect accuracy in all scenarios, and users should verify outcomes where correctness is critical.</p>
      </div>
      <div className="mt-8"><Link href="/" className="text-blue-600 hover:underline">Back to home</Link></div>
    </div>
  );
}
