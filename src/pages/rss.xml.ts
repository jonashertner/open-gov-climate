import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const foia = await getCollection('foia');
  const articles = await getCollection('articles');

  const enFoia = foia.filter(f => f.data.lang === 'en');
  const enArticles = articles.filter(a => a.data.lang === 'en');

  const items = [
    ...enFoia.map(f => ({
      title: f.data.title,
      link: `https://opengovclimate.ch/en/foia/${f.data.slug}/`,
      description: f.data.summary,
      pubDate: f.data.dateSubmitted,
    })),
    ...enArticles.map(a => ({
      title: a.data.title,
      link: `https://opengovclimate.ch/en/articles/${a.data.slug}/`,
      description: a.data.summary,
      pubDate: a.data.date,
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Open Gov Climate</title>
    <link>https://opengovclimate.ch</link>
    <description>Swiss transparency initiative for alpine climate intervention projects.</description>
    <language>en</language>
    <atom:link href="https://opengovclimate.ch/rss.xml" rel="self" type="application/rss+xml"/>
${items.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate.toUTCString()}</pubDate>
      <guid>${item.link}</guid>
    </item>`).join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
