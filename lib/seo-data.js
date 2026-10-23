import tools from '../data/tools';

export function normalizeCategory(category = '') {
  return String(category)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'uncategorized';
}

export function categoryToSlug(category = '') {
  return normalizeCategory(category);
}

export function toSentenceCase(value = '') {
  return String(value)
    .replace(/\s+/g, ' ')
    .trim();
}

export function makeExactDescription(baseText = '', fallback = '') {
  const raw = toSentenceCase(baseText || fallback || '');
  if (!raw) {
    return ' '.repeat(150);
  }

  let result = raw.slice(0, 150).trimEnd();
  while (result.length < 150) {
    result += ' ';
  }

  return result.slice(0, 150);
}

const createToolDescription = (tool) => {
  const detail = `${tool.title} helps you handle ${tool.category.toLowerCase()} work quickly. ${tool.desc} Get clear steps, practical examples, and reliable results in a clean interface built for productivity, accuracy, and everyday online tasks.`;
  return makeExactDescription(detail);
};

const createCategoryDescription = (category) => {
  const categoryLabel = category.toLowerCase();
  const detail = `${category} tools help you handle ${categoryLabel} tasks faster. Explore useful utilities, quick workflows, and practical features for everyday productivity, strong results, and confident decision making online.`;
  return makeExactDescription(detail);
};

export function buildToolSeo(tool) {
  const description = createToolDescription(tool);
  return {
    title: `${tool.title} - AI90s.site`,
    description,
    canonical: `https://www.ai90s.site/tools/${tool.slug}`,
    ogTitle: `${tool.title} - AI90s.site`,
    ogDescription: description,
  };
}

export function buildCategorySeo(category) {
  const description = createCategoryDescription(category);
  return {
    title: `${category} Tools - AI90s.site`,
    description,
    canonical: `https://www.ai90s.site/categories/${categoryToSlug(category)}`,
    ogTitle: `${category} Tools - AI90s.site`,
    ogDescription: description,
  };
}

export function buildStaticPageSeo(title, intro) {
  const base = `${intro} This page gives you practical information, helpful guidance, and a clear overview for everyday use with reliable, user-friendly tools and consistent results.`;
  return {
    title: `${title} - AI90s.site`,
    description: makeExactDescription(base),
    canonical: `https://www.ai90s.site${title === 'Home' ? '/' : '/' + title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
    ogTitle: `${title} - AI90s.site`,
    ogDescription: makeExactDescription(base),
  };
}

export const DEFAULT_HOME_DESCRIPTION = makeExactDescription('AI90s.site brings together fast, practical tools for writing, calculations, finance, image work, SEO, and everyday productivity. Explore useful utilities, compare options, and solve tasks quickly with clear interfaces and confident results.');

export const STATIC_PAGE_META = {
  '/about': {
    title: 'About',
    intro: 'Learn about AI90s.site and how our collection of online tools helps users work faster, more clearly, and with better results every day.',
  },
  '/contact': {
    title: 'Contact',
    intro: 'Reach out to AI90s.site for support, feedback, or questions about tools, categories, and online utility features across the platform.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy',
    intro: 'Understand how AI90s.site handles data, protects user information, and maintains safe, respectful practices across its online tools.',
  },
  '/terms': {
    title: 'Terms',
    intro: 'Review AI90s.site terms of use to understand acceptable behavior, responsibilities, and usage expectations for everyday visitors and users.',
  },
  '/disclaimer': {
    title: 'Disclaimer',
    intro: 'Read the AI90s.site disclaimer for important information about tool accuracy, practical limits, and everyday usage expectations.',
  },
};

export function getToolMetadata(tool) {
  const seo = buildToolSeo(tool);
  return {
    ...seo,
    route: `/tools/${tool.slug}`,
  };
}

export function getCategoryMetadata(category) {
  const seo = buildCategorySeo(category);
  return {
    ...seo,
    route: `/categories/${categoryToSlug(category)}`,
  };
}

export function getStaticPageMeta(pathname) {
  const entry = STATIC_PAGE_META[pathname];
  if (!entry) return null;
  const seo = buildStaticPageSeo(entry.title, entry.intro);
  return {
    ...seo,
    route: pathname,
  };
}

export function getToolBySlug(slug) {
  return tools.find((tool) => tool.slug === slug);
}

export function getCategories() {
  return Array.from(new Set(tools.map((tool) => tool.category))).sort((a, b) => a.localeCompare(b));
}

export function getCategoryFromSlug(slug) {
  const normalized = String(slug || '').toLowerCase();
  return getCategories().find((category) => categoryToSlug(category) === normalized) || null;
}

export function getCategoryRoute(category) {
  return `/categories/${categoryToSlug(category)}`;
}

export function getAllPublishedRoutes() {
  const staticRoutes = ['/', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];
  const toolRoutes = tools.map((tool) => `/tools/${tool.slug}`);
  const categoryRoutes = getCategories().map((category) => getCategoryRoute(category));
  return [...new Set([...staticRoutes, ...toolRoutes, ...categoryRoutes])];
}

export function getHomeMetadata() {
  return {
    title: 'AI90s.site | Online Utility Tools',
    description: DEFAULT_HOME_DESCRIPTION,
    canonical: 'https://www.ai90s.site/',
    ogTitle: 'AI90s.site | Online Utility Tools',
    ogDescription: DEFAULT_HOME_DESCRIPTION,
  };
}

export function getPageMetadataForRoute(route) {
  if (route === '/') return getHomeMetadata();
  if (route.startsWith('/tools/')) {
    const tool = getToolBySlug(route.replace('/tools/', ''));
    if (!tool) return null;
    return getToolMetadata(tool);
  }
  if (route.startsWith('/categories/')) {
    const category = getCategoryFromSlug(route.replace('/categories/', ''));
    if (!category) return null;
    return getCategoryMetadata(category);
  }
  const pageMeta = getStaticPageMeta(route);
  if (!pageMeta) return null;
  return {
    title: pageMeta.title,
    description: pageMeta.description,
    canonical: `https://www.ai90s.site${route}`,
    ogTitle: `${pageMeta.title} - AI90s.site`,
    ogDescription: pageMeta.description,
  };
}
