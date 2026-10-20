import tools from '@/data/tools';

const baseUrl = 'https://www.ai90s.site';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
