import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['foundations', 'essentials', 'intermediate', 'advanced']),
    order: z.number().default(0),
    publishedDate: z.string().optional(),
    updatedDate: z.string().optional(),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
    relatedTools: z.array(z.string()).default([]),
    relatedGuides: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const achievements = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/achievements' }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string(),
    points: z.number(),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['ready', 'soon']),
    order: z.number().default(0),
  }),
});

// Site singletons — each file has its own shape; use loose typing here.
// Pages cast to specific types after loading.
const site = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/site' }),
  schema: z.record(z.unknown()),
});

export const collections = { guides, achievements, tools, site };
