import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sprint = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sprint' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    youtubeId: z.string().optional(),
    image: z.string().optional(),
  }),
});

const workbench = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/workbench' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    youtubeId: z.string().optional(),
    series: z.string().optional(),
    image: z.string().optional(),
  }),
});

const paddock = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paddock' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    guest: z.string(),
    guestTitle: z.string().optional(),
    tags: z.array(z.string()).default([]),
    youtubeId: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { sprint, workbench, paddock };
