import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One "card" = one Markdown file. The fields here are the same fields the forms show.
const people = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/people' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    group: z.string(),
    photo: z.string().optional().nullable(),
    former: z.boolean().optional().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    link: z.string().optional().nullable(),
  }),
});

const datasets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/datasets' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    where: z.string(),
  }),
});

export const collections = { people, news, datasets };
