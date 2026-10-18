import '../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Multi-Tool Hub',
  description: 'A modern collection of online tools for productivity, finance, SEO, PDF, images, and development.',
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'Multi-Tool Hub',
    description: 'A modern collection of online tools for productivity, finance, SEO, PDF, images, and development.',
    url: 'https://example.com',
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
