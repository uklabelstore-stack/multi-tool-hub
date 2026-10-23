import Link from 'next/link';
import { getStaticPageMeta } from '@/lib/seo-data';

export const metadata = {
  title: 'Privacy Policy - AI90s.site',
  description: getStaticPageMeta('/privacy-policy').description,
  alternates: { canonical: 'https://www.ai90s.site/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy - AI90s.site',
    description: getStaticPageMeta('/privacy-policy').description,
    url: 'https://www.ai90s.site/privacy-policy',
    siteName: 'AI90s.site',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-black text-slate-900">Privacy Policy</h1>
      <p className="mt-5 text-lg text-slate-600">AI90s.site is designed to keep the experience simple and privacy-conscious. We do not sell personal data and we only ask for information that is needed for proper functionality.</p>
      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Most tools work directly in the browser. If you provide text or files, they are processed locally whenever possible and are not stored in a way that is used for unrelated tracking or marketing.</p>
      </div>
      <div className="mt-8"><Link href="/" className="text-blue-600 hover:underline">Back to home</Link></div>
    </div>
  );
}
