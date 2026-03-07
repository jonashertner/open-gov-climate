import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const evidence = await getCollection('evidence');
  const enEvidence = evidence.filter(e => e.data.lang === 'en');

  const data = enEvidence.map(e => ({
    slug: e.data.slug,
    title: e.data.title,
    summary: e.data.summary,
    status: e.data.status,
    domain: e.data.domain,
    subdomain: e.data.subdomain,
    sourceType: e.data.sourceType,
    sourceAuthority: e.data.sourceAuthority,
    legalBasis: e.data.legalBasis,
    legalProvisions: e.data.legalProvisions,
    jurisdiction: e.data.jurisdiction,
    citation: e.data.citation,
    canton: e.data.canton,
    municipality: e.data.municipality ?? null,
    siteName: e.data.siteName ?? null,
    coordinates: e.data.coordinates,
    dateSourced: e.data.dateSourced.toISOString(),
    dateVerified: e.data.dateVerified?.toISOString() ?? null,
    datePublished: e.data.datePublished?.toISOString() ?? null,
    measurementStart: e.data.measurementStart?.toISOString() ?? null,
    measurementEnd: e.data.measurementEnd?.toISOString() ?? null,
    metrics: e.data.metrics ?? null,
    files: e.data.files,
  }));

  return new Response(JSON.stringify({ evidence: data }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
