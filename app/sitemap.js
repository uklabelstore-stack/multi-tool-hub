import tools from '@/data/tools';

const SITE_URL = 'https://www.ai90s.site';

export default function sitemap() {
  const staticRoutes = ['/', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];
  const toolRoutes = tools.map((tool) => `/tools/${tool.slug}`);
  const categoryRoutes = [...new Set(tools.map((tool) => `/categories/${tool.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`))];

  const urls = [...new Set([...staticRoutes, ...toolRoutes, ...categoryRoutes])]
    .filter((route) => route && route !== '/404')
    .map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '/' ? 'weekly' : 'monthly',
      priority: route === '/' ? 1 : 0.7,
    }));

  return urls;
}
