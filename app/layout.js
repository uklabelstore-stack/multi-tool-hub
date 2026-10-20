import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('https://www.ai90s.site'),
  title: 'Multi-Tool Hub',
  description: 'A modern collection of online tools for productivity, finance, SEO, PDF, images, and development.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Multi-Tool Hub',
    description: 'A modern collection of online tools for productivity, finance, SEO, PDF, images, and development.',
    url: 'https://www.ai90s.site',
    siteName: 'Multi-Tool Hub',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-50 nav-sticky border-b border-gray-200">
          <Navbar />
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
