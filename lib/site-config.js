import tools from '@/data/tools';
import { buildCategorySeo, getToolMetadata, getCategoryMetadata, DEFAULT_HOME_DESCRIPTION, getCategories, getCategoryRoute } from '@/lib/seo-data';

export const SITE_URL = 'https://www.ai90s.site';

export const categories = getCategories();

export const popularTools = [
  'word-counter',
  'qr-code-generator',
  'password-generator',
  'case-converter',
  'percentage-calculator',
  'bmi-calculator',
  'age-calculator',
].filter((slug) => tools.some((tool) => tool.slug === slug));

export function getToolBySlug(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function getAllPublishedRoutes() {
  const staticRoutes = ['/', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];
  const toolRoutes = tools.map((tool) => `/tools/${tool.slug}`);
  const categoryRoutes = categories.map((category) => getCategoryRoute(category));
  return [...new Set([...staticRoutes, ...toolRoutes, ...categoryRoutes])];
}

export function getHomeMetadata() {
  return {
    title: 'AI90s.site | Online Utility Tools',
    description: DEFAULT_HOME_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    ogTitle: 'AI90s.site | Online Utility Tools',
    ogDescription: DEFAULT_HOME_DESCRIPTION,
  };
}

export function getPageMetadataForRoute(route) {
  if (route === '/') return getHomeMetadata();

  if (route.startsWith('/tools/')) {
    const slug = route.replace('/tools/', '');
    const tool = getToolBySlug(slug);
    if (!tool) return null;
    return getToolMetadata(tool);
  }

  if (route.startsWith('/categories/')) {
    const categoryName = decodeURIComponent(route.replace('/categories/', '')).replace(/-/g, ' ');
    const matchedCategory = categories.find((item) => item.toLowerCase() === categoryName.toLowerCase());
    if (!matchedCategory) return null;
    return getCategoryMetadata(matchedCategory);
  }

  const staticMeta = {
    '/about': { title: 'About', description: DEFAULT_HOME_DESCRIPTION },
    '/contact': { title: 'Contact', description: DEFAULT_HOME_DESCRIPTION },
    '/privacy-policy': { title: 'Privacy Policy', description: DEFAULT_HOME_DESCRIPTION },
    '/terms': { title: 'Terms', description: DEFAULT_HOME_DESCRIPTION },
    '/disclaimer': { title: 'Disclaimer', description: DEFAULT_HOME_DESCRIPTION },
  };

  const selected = staticMeta[route];
  if (!selected) return null;

  return {
    title: selected.title,
    description: selected.description,
    canonical: `${SITE_URL}${route}`,
    ogTitle: `${selected.title} - AI90s.site`,
    ogDescription: selected.description,
  };
}

export function getCategoryData(category) {
  const realCategory = categories.find((item) => item.toLowerCase() === category.toLowerCase());
  if (!realCategory) return null;

  return {
    category: realCategory,
    seo: buildCategorySeo(realCategory),
    tools: tools.filter((tool) => tool.category === realCategory),
  };
}
