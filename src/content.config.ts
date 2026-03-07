import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const evidence = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/evidence', generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/\//g, '-') }),
  schema: z.object({
    // Core
    slug: z.string(),
    lang: z.enum(['en', 'de', 'fr', 'it']),
    title: z.string(),
    summary: z.string(),
    status: z.enum(['sourced', 'verified', 'published']),
    dateSourced: z.coerce.date(),
    dateVerified: z.coerce.date().optional(),
    datePublished: z.coerce.date().optional(),

    // Source provenance
    sourceType: z.enum(['foia', 'government-report', 'monitoring-data', 'academic-study', 'public-dataset']),
    sourceAuthority: z.string(),
    sourceDocument: z.string().optional(),
    acquisitionMethod: z.string(),
    foiaReference: z.string().optional(),

    // Legal citation
    citation: z.string(),
    legalBasis: z.string(),
    legalProvisions: z.array(z.string()).default([]),
    jurisdiction: z.enum(['federal', 'cantonal', 'municipal']),

    // Geospatial
    coordinates: z.object({ lat: z.number(), lng: z.number() }),
    canton: z.string(),
    municipality: z.string().optional(),
    siteName: z.string().optional(),

    // Temporal provenance
    measurementStart: z.coerce.date().optional(),
    measurementEnd: z.coerce.date().optional(),
    collectionDate: z.coerce.date().optional(),
    authorityPublicationDate: z.coerce.date().optional(),
    acquisitionDate: z.coerce.date(),
    lastVerifiedDate: z.coerce.date().optional(),

    // Environmental domain
    domain: z.enum(['soil', 'air', 'forest', 'water']),
    subdomain: z.string(),
    metrics: z.string().optional(),
    dataFormat: z.enum(['pdf', 'csv', 'geojson', 'xlsx']).optional(),
    files: z.array(z.object({
      label: z.string(),
      url: z.string(),
      format: z.string(),
    })).default([]),

    // Backward compatibility (FOIA entries)
    requestPdf: z.string().optional(),
    responsePdf: z.string().optional(),
    relatedSlugs: z.array(z.string()).default([]),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles', generateId: ({ entry }) => entry.replace(/\.md$/, '').replace(/\//g, '-') }),
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

export const collections = { evidence, articles };
