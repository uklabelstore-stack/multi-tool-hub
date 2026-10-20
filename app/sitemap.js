import tools from '@/data/tools';

const baseUrl = 'https://www.ai90s.site';

export default function sitemap() {
  const staticRoutes = ['/'];
  const toolRoutes = tools
    .filter((tool) => tool && tool.slug)
    .map((tool) => `/tools/${tool.slug}`);

  return [...staticRoutes, ...toolRoutes].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
