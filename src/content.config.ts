import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const foia = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/foia' }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'de', 'fr', 'it']),
    title: z.string(),
    summary: z.string(),
    status: z.enum(['submitted', 'acknowledged', 'responded', 'published']),
    category: z.string(),
    authority: z.string(),
    legalBasis: z.string(),
    dateSubmitted: z.coerce.date(),
    dateAcknowledged: z.coerce.date().optional(),
    dateResponded: z.coerce.date().optional(),
    datePublished: z.coerce.date().optional(),
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
    requestPdf: z.string(),
    responsePdf: z.string().optional(),
    relatedSlugs: z.array(z.string()).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    slug: z.string(),
    lang: z.enum(['en', 'de', 'fr', 'it']),
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    relatedSlugs: z.array(z.string()).default([]),
  }),
});

export const collections = { foia, articles };
