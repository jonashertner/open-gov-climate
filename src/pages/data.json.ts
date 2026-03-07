import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const foia = await getCollection('foia');
  const enFoia = foia.filter(f => f.data.lang === 'en');

  const data = enFoia.map(f => ({
    slug: f.data.slug,
    title: f.data.title,
    summary: f.data.summary,
    status: f.data.status,
    category: f.data.category,
    authority: f.data.authority,
    legalBasis: f.data.legalBasis,
    dateSubmitted: f.data.dateSubmitted.toISOString(),
    dateAcknowledged: f.data.dateAcknowledged?.toISOString() ?? null,
    dateResponded: f.data.dateResponded?.toISOString() ?? null,
    datePublished: f.data.datePublished?.toISOString() ?? null,
    coordinates: f.data.coordinates,
    requestPdf: f.data.requestPdf,
    responsePdf: f.data.responsePdf ?? null,
  }));

  return new Response(JSON.stringify({ foia: data }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
