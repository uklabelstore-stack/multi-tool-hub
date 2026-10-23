import tools from '@/data/tools';
import { buildCategorySeo, getToolMetadata, getCategoryMetadata, DEFAULT_HOME_DESCRIPTION } from '@/lib/seo-data';

export const SITE_URL = 'https://www.ai90s.site';

export const categories = Array.from(new Set(tools.map((tool) => tool.category))).sort((a, b) => a.localeCompare(b));

export const popularTools = [
  'word-counter',
  'qr-code-generator',
  'password-generator',
  'case-converter',
  'percentage-calculator',
  'bmi-calculator',
  'age-calculator',
  'pdf-to-word',
].filter((slug) => tools.some((tool) => tool.slug === slug));

export function getToolBySlug(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategoryRoute(category) {
  return `/categories/${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
}

export function getAllPublishedRoutes() {
  const toolRoutes = tools.map((tool) => `/tools/${tool.slug}`);
  const categoryRoutes = categories.map((category) => getCategoryRoute(category));
  const staticRoutes = ['/', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];
  return [...new Set([...staticRoutes, ...toolRoutes, ...categoryRoutes])];
}

export function getHomeMetadata() {
  return {
    title: 'AI90s.site | All-in-one Online Utility Tools',
    description: DEFAULT_HOME_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    ogTitle: 'AI90s.site | All-in-one Online Utility Tools',
    ogDescription: DEFAULT_HOME_DESCRIPTION,
  };
}

export function getPageMetadataForRoute(route) {
  if (route === '/') {
    return getHomeMetadata();
  }

  if (route.startsWith('/tools/')) {
    const slug = route.replace('/tools/', '');
    const tool = getToolBySlug(slug);
    if (!tool) return null;
    return getToolMetadata(tool);
  }

  if (route.startsWith('/categories/')) {
    const category = decodeURIComponent(route.replace('/categories/', '')).replace(/-/g, ' ');
    const matchedCategory = categories.find((item) => item.toLowerCase() === category.toLowerCase());
    if (!matchedCategory) return null;
    return getCategoryMetadata(matchedCategory);
  }

  if (route === '/about' || route === '/contact' || route === '/privacy-policy' || route === '/terms' || route === '/disclaimer') {
    const staticMeta = {
      '/about': { title: 'About AI90s.site', description: DEFAULT_HOME_DESCRIPTION },
      '/contact': { title: 'Contact AI90s.site', description: DEFAULT_HOME_DESCRIPTION },
      '/privacy-policy': { title: 'Privacy Policy', description: DEFAULT_HOME_DESCRIPTION },
      '/terms': { title: 'Terms of Use', description: DEFAULT_HOME_DESCRIPTION },
      '/disclaimer': { title: 'Disclaimer', description: DEFAULT_HOME_DESCRIPTION },
    };

    const selected = staticMeta[route];
    if (!selected) return null;

    return {
      title: selected.title,
      description: selected.description,
      canonical: `${SITE_URL}${route}`,
      ogTitle: `${selected.title} | AI90s.site`,
      ogDescription: selected.description,
    };
  }

  return null;
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
