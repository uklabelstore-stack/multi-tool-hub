import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-black text-slate-900">Page not found</h1>
      <p className="mt-4 text-lg text-slate-600">The page you requested does not exist or has moved.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-medium text-white">Return home</Link>
    </div>
  );
}
