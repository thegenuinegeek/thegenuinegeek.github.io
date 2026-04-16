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
    share: z.boolean().default(false),
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
    share: z.boolean().default(false),
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
    hosts: z.string().optional(),
    hostShow: z.string().optional(),
    tags: z.array(z.string()).default([]),
    youtubeId: z.string().optional(),
    image: z.string().optional(),
    share: z.boolean().default(false),
  }),
});

export const collections = { sprint, workbench, paddock };
