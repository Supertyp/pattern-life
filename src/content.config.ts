import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Pattern types: how a pattern helps.
//   technique   — a concrete way of doing something (using a tool, a manoeuvre)
//   process     — an order of work or routine for a recurring task
//   preparation — what to plan, check or bring before you start
//   safety      — avoiding harm to yourself, others or equipment
//   etiquette   — shared spaces and getting along with other people
//   recipe      — applies several general patterns to one dish and says what is specific to it
export const PATTERN_TYPES = ['technique', 'process', 'preparation', 'safety', 'etiquette', 'recipe'] as const;

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(PATTERN_TYPES),
    cluster: z.string(),
    problem: z.string(),
    appliesWhen: z.array(z.string()).min(1),
    authors: z.array(z.string()).default(['Pattern Life team']),
    editors: z.array(z.string()).default([]),
    // Ids of closely related patterns. Links are shown in both directions on the pattern pages.
    related: z.array(z.string()).default([]),
    published: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const clusters = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/clusters' }),
  schema: z.object({
    title: z.string(),
    framing: z.string(),
    order: z.number().default(100),
  }),
});

export const collections = { patterns, clusters };
