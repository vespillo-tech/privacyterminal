import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = true;

export async function GET(context: APIContext) {
  const guides = await getCollection('guides');
  const published = guides
    .filter((g) => !g.data.draft)
    .sort((a, b) => (b.data.order || 0) - (a.data.order || 0));

  return rss({
    title: 'Privacy Terminal — Guides & Education',
    description: 'Privacy education and tool updates from Privacy Terminal. Learn to protect your digital identity with comprehensive guides and open-source tools.',
    site: context.site!.toString(),
    items: published.map((guide) => ({
      title: guide.data.title,
      description: guide.data.description,
      link: `/guides/${guide.id}/`,
      categories: [guide.data.category, ...guide.data.tags],
      pubDate: guide.data.publishedDate ? new Date(guide.data.publishedDate) : new Date(),
    })),
    customData: [
      '<language>en-us</language>',
      '<copyright>Privacy Terminal — CC BY-SA 4.0</copyright>',
      '<managingEditor>security@privacyterminal.com</managingEditor>',
      '<webMaster>security@privacyterminal.com</webMaster>',
      '<ttl>1440</ttl>',
    ].join('\n'),
    stylesheet: '/rss-styles.xsl',
  });
}
