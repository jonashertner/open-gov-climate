import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');
const fail = (message) => { throw new Error(`Publication verification failed: ${message}`); };
const requireMatch = (value, pattern, message) => { if (!pattern.test(value)) fail(message); };

const landingPages = {
  'dist/index.html': 'de',
  'dist/de/index.html': 'de',
  'dist/en/index.html': 'en',
  'dist/fr/index.html': 'fr',
  'dist/it/index.html': 'it',
  'dist/rm/index.html': 'rm',
};

for (const [path, lang] of Object.entries(landingPages)) {
  const html = read(path);
  requireMatch(html, new RegExp(`<html\\s+lang="${lang}"`), `${path} has the wrong document language`);
  requireMatch(html, /<meta name="robots" content="index, follow">/, `${path} is not public and indexable`);
  if (/gate-locked|id="gate"/.test(html)) fail(`${path} still contains the retired access gate`);
  const riverPath = lang === 'de' ? '/riverflow/' : `/riverflow/${lang}/`;
  for (const href of [riverPath, `${riverPath}method.html`, `${riverPath}sources.html`, `${riverPath}about.html#collaborate`]) {
    if (!html.includes(`href="${href}"`)) fail(`${path} does not link to ${href}`);
  }
  for (const code of ['DE', 'EN', 'FR', 'IT', 'RM']) {
    if (!html.includes(`>${code}<`)) fail(`${path} is missing the ${code} language choice`);
  }
  requireMatch(html, /class="cycle-path"[\s\S]*?<li>/, `${path} does not state the water-cycle scope`);
  requireMatch(html, /class="collab-section"/, `${path} does not invite collaboration`);
}

for (const path of ['dist/archive/index.html', 'dist/archive/de/index.html', 'dist/archive/en/index.html', 'dist/archive/fr/index.html', 'dist/archive/it/index.html']) {
  const html = read(path);
  if (!/class="gate-locked"/.test(html) || !/name="robots" content="noindex, nofollow"/.test(html)) {
    fail(`${path} is not preserved as a private, non-indexed archive`);
  }
}

const robots = read('dist/robots.txt');
if (/^Disallow:\s*\/$/m.test(robots)) fail('robots.txt still blocks the public homepage');
requireMatch(robots, /^Disallow:\s*\/archive\/$/m, 'robots.txt does not protect the archive');

const sitemap = read('dist/sitemap.xml');
for (const path of ['/', '/en/', '/fr/', '/it/', '/rm/', '/riverflow/']) {
  if (!sitemap.includes(`<loc>https://opengovclimate.ch${path}</loc>`)) fail(`sitemap.xml is missing ${path}`);
}

if (statSync(join(root, 'dist/riverflow-preview.jpg')).size > 250_000) fail('Riverflow preview exceeds 250 kB');
if (statSync(join(root, 'src/styles/landing.css')).size > 24_000) fail('landing stylesheet exceeds 24 kB');

console.log(`Publication verified: ${Object.keys(landingPages).length} public landings, 5 archived landings.`);
