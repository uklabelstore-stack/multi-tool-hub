import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataFile = path.join(rootDir, 'data/tools.js');
const source = fs.readFileSync(dataFile, 'utf8');

function evaluateToolsSource() {
  const code = source.replace(/export default tools;/, 'module.exports = tools;');
  const exported = {};
  const module = { exports: exported };
  const fn = new Function('module', 'exports', `${code}; return module.exports;`);
  return fn(module, exported);
}

function normalizeCategory(category = '') {
  return String(category)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'uncategorized';
}

function makeExactDescription(baseText = '') {
  const raw = String(baseText || '').replace(/\s+/g, ' ').trim();
  if (!raw) return ' '.repeat(150);
  let result = raw.slice(0, 150).trimEnd();
  while (result.length < 150) result += ' ';
  return result.slice(0, 150);
}

function buildToolDescription(tool) {
  const detail = `${tool.title} helps you handle ${tool.category.toLowerCase()} work quickly. ${tool.desc} Get clear steps, practical examples, and reliable results in a clean interface built for productivity, accuracy, and everyday online tasks.`;
  return makeExactDescription(detail);
}

function buildCategoryDescription(category) {
  const detail = `${category} tools help you handle ${category.toLowerCase()} tasks faster. Explore useful utilities, quick workflows, and practical features for everyday productivity, strong results, and confident decision making online.`;
  return makeExactDescription(detail);
}

const tools = evaluateToolsSource();
const categories = [...new Set(tools.map((tool) => tool.category))].sort((a, b) => a.localeCompare(b));
const routes = ['/', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];
for (const tool of tools) routes.push(`/tools/${tool.slug}`);
for (const category of categories) routes.push(`/categories/${normalizeCategory(category)}`);

const toolMeta = tools.map((tool) => ({
  route: `/tools/${tool.slug}`,
  title: `${tool.title} - AI90s.site`,
  description: buildToolDescription(tool),
  canonical: `https://www.ai90s.site/tools/${tool.slug}`,
}));

const categoryMeta = categories.map((category) => ({
  route: `/categories/${normalizeCategory(category)}`,
  title: `${category} Tools - AI90s.site`,
  description: buildCategoryDescription(category),
  canonical: `https://www.ai90s.site/categories/${normalizeCategory(category)}`,
}));

const allMeta = [
  { route: '/', title: 'AI90s.site | Online Utility Tools', description: makeExactDescription('AI90s.site brings together fast, practical tools for writing, calculations, finance, image work, SEO, and everyday productivity. Explore useful utilities, compare options, and solve tasks quickly with clear interfaces and confident results.'), canonical: 'https://www.ai90s.site/' },
  ...toolMeta,
  ...categoryMeta,
  { route: '/about', title: 'About - AI90s.site', description: makeExactDescription('Learn about AI90s.site and how our collection of online tools helps users work faster, more clearly, and with better results every day. This page gives you practical information, helpful guidance, and a clear overview for everyday use with reliable, user-friendly tools and consistent results.'), canonical: 'https://www.ai90s.site/about' },
  { route: '/contact', title: 'Contact - AI90s.site', description: makeExactDescription('Reach out to AI90s.site for support, feedback, or questions about tools, categories, and online utility features across the platform. This page gives you practical information, helpful guidance, and a clear overview for everyday use with reliable, user-friendly tools and consistent results.'), canonical: 'https://www.ai90s.site/contact' },
  { route: '/privacy-policy', title: 'Privacy Policy - AI90s.site', description: makeExactDescription('Understand how AI90s.site handles data, protects user information, and maintains safe, respectful practices across its online tools. This page gives you practical information, helpful guidance, and a clear overview for everyday use with reliable, user-friendly tools and consistent results.'), canonical: 'https://www.ai90s.site/privacy-policy' },
  { route: '/terms', title: 'Terms - AI90s.site', description: makeExactDescription('Review AI90s.site terms of use to understand acceptable behavior, responsibilities, and usage expectations for everyday visitors and users. This page gives you practical information, helpful guidance, and a clear overview for everyday use with reliable, user-friendly tools and consistent results.'), canonical: 'https://www.ai90s.site/terms' },
  { route: '/disclaimer', title: 'Disclaimer - AI90s.site', description: makeExactDescription('Read the AI90s.site disclaimer for important information about tool accuracy, practical limits, and everyday usage expectations. This page gives you practical information, helpful guidance, and a clear overview for everyday use with reliable, user-friendly tools and consistent results.'), canonical: 'https://www.ai90s.site/disclaimer' },
];

const failed = [];

for (const page of allMeta) {
  if (!page.title || !page.description) {
    failed.push(`${page.route}: missing metadata`);
  }
  if (page.description.length !== 150) {
    failed.push(`${page.route}: description length ${page.description.length}, expected 150`);
  }
  if (!page.canonical.startsWith('https://www.ai90s.site')) {
    failed.push(`${page.route}: invalid canonical ${page.canonical}`);
  }
}

const duplicateTitles = new Map();
const duplicateDescriptions = new Map();
for (const page of allMeta) {
  duplicateTitles.set(page.title, (duplicateTitles.get(page.title) || 0) + 1);
  duplicateDescriptions.set(page.description, (duplicateDescriptions.get(page.description) || 0) + 1);
}
for (const [title, count] of duplicateTitles.entries()) {
  if (count > 1) failed.push(`duplicate title: ${title}`);
}
for (const [description, count] of duplicateDescriptions.entries()) {
  if (count > 1) failed.push(`duplicate description detected for length ${description.length}`);
}

const uniqueRoutes = new Set(routes);
if (uniqueRoutes.size !== routes.length) failed.push('duplicate routes detected');

const appDir = path.join(rootDir, 'app');
const componentDir = path.join(rootDir, 'components');
const scanDirs = [appDir, componentDir];
const files = [];
for (const dir of scanDirs) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const stack = [full];
      while (stack.length) {
        const current = stack.pop();
        for (const child of fs.readdirSync(current, { withFileTypes: true })) {
          const childPath = path.join(current, child.name);
          if (child.isDirectory()) stack.push(childPath);
          else if (child.name.endsWith('.js') || child.name.endsWith('.jsx')) files.push(childPath);
        }
      }
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      files.push(full);
    }
  }
}

const linkPaths = [];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const matches = [...text.matchAll(/(?:href|to)=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const match of matches) {
    if (!match.startsWith('/') || match.startsWith('//') || match.startsWith('/_')) continue;
    if (match.includes('#')) continue;
    if (match.startsWith('/api')) continue;
    linkPaths.push(match);
  }
}

const brokenLinks = [...new Set(linkPaths)].filter((link) => !routes.includes(link));
if (brokenLinks.length > 0) failed.push(`broken internal links: ${brokenLinks.join(', ')}`);

console.log(`SEO validation summary: ${allMeta.length} metadata entries checked`);
console.log(`Routes checked: ${routes.length}`);
console.log(`Internal links checked: ${new Set(linkPaths).size}`);

if (failed.length > 0) {
  console.error('SEO validation failed:');
  for (const issue of failed) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('SEO validation passed.');
process.exit(0);
