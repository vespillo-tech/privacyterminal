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

export const collections = { guides };
