import Link from 'next/link';

const navItems = [
  { label: 'Text', href: '/?cat=Text' },
  { label: 'Health', href: '/?cat=Health' },
  { label: 'Finance', href: '/?cat=Finance' },
  { label: 'Converters', href: '/?cat=Converters' },
  { label: 'Generators', href: '/?cat=Generators' },
  { label: 'Developer', href: '/?cat=Developer' },
];

export default function Navbar() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            MT
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">Multi-Tool Hub</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm text-slate-700 hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:text-blue-600">
          Explore tools
        </button>
      </div>
    </div>
  );
}
