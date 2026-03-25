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
    tldr: z.array(z.string()).default([]),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string(),
    })).default([]),
    difficulty: z.number().min(1).max(5).default(1),
    requires: z.array(z.string()).default([]),
    requiresAny: z.array(z.string()).default([]),
    requiresRecon: z.number().default(0),
    requiresHardening: z.number().default(0),
    tier: z.enum(['recon', 'hardening', 'ops']).default('recon'),
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

const challenges = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/challenges' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['hardening', 'recon', 'operations']),
    difficulty: z.number().min(1).max(5),
    verificationTool: z.string(),
    verificationTarget: z.string(),
    reward: z.number(),
  })
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    source: z.string(),
    sourceUrl: z.string(),
    date: z.string(),
    category: z.enum(['legislation', 'breach', 'tool-release', 'research', 'corporate']),
    tags: z.array(z.string()).default([]),
    tldr: z.string(),
  }),
});

export const collections = { guides, achievements, tools, site, challenges, news };
