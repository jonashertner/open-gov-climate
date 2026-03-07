# opengovclimate.ch World-Class Overhaul — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild opengovclimate.ch as a world-class Astro 5 static site with elevated Swiss minimalist design, full i18n, and 9 features (search, PDF viewer, timeline, advanced map, status tracker, RSS, dark mode, data export, share/cite).

**Architecture:** Astro 5 static output with Preact islands for interactive components (map, search, PDF viewer). Content Collections for FOIAs and articles. Pagefind for search. GitHub Pages deployment via GitHub Actions. i18n via Astro's built-in routing with `/en/`, `/de/`, `/fr/`, `/it/` prefixes.

**Tech Stack:** Astro 5, Preact, MapLibre GL JS, Pagefind, JetBrains Mono, Inter, GitHub Actions

**Security note:** Search result excerpts from Pagefind are generated from our own indexed site content. For defense in depth, render them as text or sanitize with DOMPurify before inserting as HTML.

---

## Task 1: Project Scaffold — Astro 5 Init

**Files:**
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `package.json` (replace existing)
- Create: `.github/workflows/deploy.yml`
- Delete: `src/index.js`, `src/App.js`, `src/i18n.js` (old React files)

**Step 1: Initialize Astro project in-place**

Remove old React dependencies and source. Initialize Astro with Preact integration.

```bash
cd /Users/jonashertner/open-gov-climate
rm -rf node_modules package-lock.json
```

Replace `package.json`:

```json
{
  "name": "open-gov-climate",
  "type": "module",
  "version": "2.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "postbuild": "npx pagefind --site dist",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/preact": "^4.0.0",
    "preact": "^10.19.0",
    "maplibre-gl": "^5.0.0"
  },
  "devDependencies": {
    "pagefind": "^1.3.0"
  }
}
```

**Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://opengovclimate.ch',
  integrations: [preact()],
  i18n: {
    locales: ['en', 'de', 'fr', 'it'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
    },
  },
});
```

**Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

**Step 4: Create GitHub Actions deploy workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v5
      - name: Install, build, and upload
        uses: withastro/action@v5

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 5: Install dependencies and verify build**

```bash
npm install
npx astro build
```

Expected: Build succeeds (empty site, no pages yet).

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Astro 5 project with Preact and GitHub Actions deploy"
```

---

## Task 2: Design System — CSS Tokens and Global Styles

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`

**Step 1: Create CSS design tokens**

Create `src/styles/tokens.css`:

```css
:root {
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace;

  --text-xs: clamp(0.625rem, 0.2vw + 0.575rem, 0.6875rem);
  --text-sm: clamp(0.75rem, 0.2vw + 0.7rem, 0.8125rem);
  --text-base: clamp(1rem, 0.25vw + 0.9rem, 1.125rem);
  --text-lg: clamp(1.125rem, 0.3vw + 1rem, 1.25rem);
  --text-xl: clamp(1.25rem, 0.5vw + 1.1rem, 1.5rem);
  --text-2xl: clamp(1.5rem, 0.8vw + 1.2rem, 2rem);
  --text-3xl: clamp(2rem, 1.5vw + 1.5rem, 3rem);
  --text-4xl: clamp(2.5rem, 2.5vw + 1.75rem, 4rem);

  --leading-tight: 1.15;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.55;

  --tracking-tight: -0.035em;
  --tracking-snug: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.08em;

  /* Spacing — 4px base */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Layout */
  --max-width: 70rem;
  --prose-width: 41.25rem;
  --gutter: clamp(1rem, 3vw, 2rem);

  /* Transitions */
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --ease: cubic-bezier(0.22, 1, 0.36, 1);

  /* Light mode (default) */
  --ink: #0a0a0a;
  --paper: #fafafa;
  --muted: #6b6b6b;
  --border: #e5e5e5;
  --surface: #f0f0f0;
  --status-green: #1a7a3a;
  --status-amber: #b45309;
  --status-red: #b91c1c;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --ink: #e5e5e5;
    --paper: #0a0a0a;
    --muted: #8b8b8b;
    --border: #262626;
    --surface: #141414;
    --status-green: #34d058;
    --status-amber: #f59e0b;
    --status-red: #f87171;
  }
}

[data-theme="dark"] {
  --ink: #e5e5e5;
  --paper: #0a0a0a;
  --muted: #8b8b8b;
  --border: #262626;
  --surface: #141414;
  --status-green: #34d058;
  --status-amber: #f59e0b;
  --status-red: #f87171;
}
```

**Step 2: Create global styles**

Create `src/styles/global.css` — full design system including:
- CSS reset
- Typography hierarchy (h1-h4, body, labels, mono accents)
- Link styles with underline offset
- Layout utilities (.container, .prose, .grid-2, .section)
- Card component (1px top border, hover effect)
- Badge component (status pills)
- Focus styles, skip link
- Touch target minimums (48px)
- Print stylesheet
- Responsive section padding
- Reduced motion support

Refer to design doc for exact values. See Task 2 in the design document for the full CSS.

**Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add design system with CSS tokens and global styles"
```

---

## Task 3: Base Layout and Dark Mode

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/DarkModeToggle.astro`

**Step 1: Create Base layout**

Create `src/layouts/Base.astro` with:
- Full `<head>` with charset, viewport, title, meta description
- Canonical URL + hreflang alternates for all 4 languages
- Open Graph + Twitter Card meta tags
- Google Fonts preconnect + Inter + JetBrains Mono
- Inline dark mode script (prevents flash: reads localStorage, sets `data-theme` before paint)
- Skip-to-content link
- Named slots: `header`, default (main content), `footer`
- `data-pagefind-body` on `<main>` for search indexing

**Step 2: Create DarkModeToggle**

Create `src/components/DarkModeToggle.astro`:
- Sun/moon SVG icons (18x18, stroke-based)
- 48x48 button for touch target
- Script: toggles `data-theme` attribute on `<html>`, persists to localStorage
- CSS: shows sun in light mode, moon in dark mode, respects system preference when no override set

**Step 3: Commit**

```bash
git add src/layouts/ src/components/DarkModeToggle.astro
git commit -m "feat: add Base layout with SEO meta, OG tags, dark mode toggle"
```

---

## Task 4: i18n System

**Files:**
- Create: `src/i18n/translations.ts`
- Create: `src/i18n/utils.ts`

**Step 1: Create translations file**

Create `src/i18n/translations.ts` — migrate all strings from existing `src/translations.json`. Structure as typed TypeScript object with keys for all 4 languages (en, de, fr, it). Key namespaces: `site.*`, `nav.*`, `hero.*`, `foia.*`, `map.*`, `articles.*`, `timeline.*`, `contact.*`, `share.*`, `search.*`, `footer.*`, `data.*`.

Export types: `Lang`, `TranslationKey`.

**Step 2: Create i18n utility**

Create `src/i18n/utils.ts` with:
- `t(lang, key)` — returns translated string with English fallback
- `getLangFromUrl(url)` — extracts lang from URL pathname
- `getLocalizedPath(lang, path)` — prefixes path with lang
- `languages` object mapping lang codes to display labels

**Step 3: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n system with 4-language translations"
```

---

## Task 5: Content Collections — FOIA and Articles

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/foia/{en,de,fr,it}/glacier-cooling-systems.md`
- Create: `src/content/foia/{en,de,fr,it}/high-altitude-solar.md`
- Create: `src/content/articles/{en,de,fr,it}/alpine-water-storage.md`

**Step 1: Define content schemas**

Create `src/content.config.ts`:

```ts
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
```

**Step 2: Migrate existing content**

Convert data from `src/data/foia.json` and `src/data/articles.json` to Markdown files with frontmatter. One file per language per entry. Body content is the full request/article text.

Example frontmatter for `src/content/foia/en/glacier-cooling-systems.md`:

```yaml
---
slug: glacier-cooling-systems
lang: en
title: Glacier Cooling Systems Study
summary: Requesting research, funding reports and data on passive and active glacier-cooling methods...
status: responded
category: Glacier Protection
authority: Federal Office for the Environment (FOEN)
legalBasis: BGO Art. 6
dateSubmitted: 2024-08-15
dateAcknowledged: 2024-08-22
dateResponded: 2024-10-03
datePublished: 2024-10-10
coordinates: { lat: 46.8, lng: 8.3 }
requestPdf: /data/foia1_request.pdf
responsePdf: /data/foia1_response.pdf
relatedSlugs: [high-altitude-solar]
---
```

**Step 3: Verify collections load**

```bash
npx astro build
```

**Step 4: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: add content collections for FOIAs and articles with Zod schemas"
```

---

## Task 6: Header and Footer Components

**Files:**
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`

**Step 1: Create Header**

Create `src/components/Header.astro`:
- Sticky, backdrop-blur, 1px bottom border
- Logo left (text link, `Inter 600, --text-sm`)
- Desktop nav center: FOIA, Map, Timeline, Articles, Contact (anchor links to homepage sections, real link for timeline page)
- Right actions: search icon button (wires to search modal), language switcher (links that swap `/en/` to `/de/` etc, active state), dark mode toggle, mobile hamburger
- Mobile: hamburger opens full-screen overlay with large nav links (--text-2xl, 600 weight) and language selector
- Escape key closes overlay
- All nav links close mobile overlay on click
- Desktop breakpoint at 1024px

**Step 2: Create Footer**

Create `src/components/Footer.astro`:
- 1px top border
- Left: copyright (mono), coordinated via jonashertner.com
- Right: nav links (Home, FOIA, Articles, Contact, RSS, Data)
- Row on desktop, stacked on mobile
- All links `--text-sm`, `--muted` color, hover to `--ink`

**Step 3: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: add Header and Footer components with nav, mobile menu, lang switcher"
```

---

## Task 7: Homepage — Hero, FOIA Grid, Articles, Contact

**Files:**
- Create: `src/pages/index.astro` (redirect to `/en/`)
- Create: `src/pages/[lang]/index.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/FOIACard.astro`
- Create: `src/components/ArticleCard.astro`
- Create: `src/components/Contact.astro`

**Step 1: Create root redirect**

Create `src/pages/index.astro` that redirects to `/en/`.

**Step 2: Create homepage**

Create `src/pages/[lang]/index.astro`:
- `getStaticPaths()` returns all 4 langs
- Fetches FOIA and article collections filtered by current lang
- Renders: Header (slot), Hero, FOIA section (grid-2 of FOIACards), Map section (container for MapIsland with data attribute), Articles section (grid-2 of ArticleCards), Contact, Footer (slot)
- Map section: full-bleed container with `data-foia` JSON attribute for the map island to consume

**Step 3: Create section components**

- `Hero.astro`: 1px top border accent, large h1 (max-width 14ch), description paragraph (prose width), arrow CTA link. Generous vertical padding.
- `FOIACard.astro`: card class (1px top border), status badge, h3 title as link, summary (muted, sm), footer row with monospace date and "Read more ->" link
- `ArticleCard.astro`: same card pattern but with category label, date, reading time, summary
- `Contact.astro`: section with label, h2, description, email link (lg, 500 weight), ProtonMail note (mono, xs, muted)

**Step 4: Verify build**

```bash
npx astro build && npx astro preview
```

**Step 5: Commit**

```bash
git add src/pages/ src/components/Hero.astro src/components/FOIACard.astro src/components/ArticleCard.astro src/components/Contact.astro
git commit -m "feat: add homepage with hero, FOIA grid, articles, contact sections"
```

---

## Task 8: FOIA Detail Page with Status Tracker and PDF Viewer

**Files:**
- Create: `src/pages/[lang]/foia/[slug].astro`
- Create: `src/components/StatusTracker.astro`
- Create: `src/components/PDFViewer.tsx` (Preact island)
- Create: `src/components/ShareCite.astro`

**Step 1: Create StatusTracker**

Create `src/components/StatusTracker.astro`:
- Horizontal pipeline: Submitted -> Acknowledged -> Responded -> Published
- Each step: circle dot + label + date (mono) below
- Completed steps: `--status-green` dot, solid connecting line
- Current step: `--status-green` dot, pulsing or bold label
- Future steps: `--muted` dot, dashed connecting line
- Responsive: horizontal on desktop, vertical on mobile (< 768px)
- Props: `status`, `dateSubmitted`, `dateAcknowledged?`, `dateResponded?`, `datePublished?`, `lang`

**Step 2: Create PDFViewer Preact island**

Create `src/components/PDFViewer.tsx`:
- Header bar with label + download link (with download icon SVG)
- `<iframe>` embedding the PDF
- Fade-in on load
- `client:visible` directive for lazy loading
- Styled: border, surface background, responsive width

**Step 3: Create ShareCite component**

Create `src/components/ShareCite.astro`:
- Row of buttons: Copy URL, Copy Citation (APA format), Twitter, LinkedIn, Email
- Clipboard API with "Copied!" feedback (swap text for 2s)
- APA citation format: "Open Gov Climate. (YYYY). *Title*. Retrieved from URL"
- Social share links use proper share URLs with encoded title/url
- Minimal styling: inline-flex row, gap, mono text buttons with 1px border

**Step 4: Create FOIA detail page**

Create `src/pages/[lang]/foia/[slug].astro`:
- `getStaticPaths()`: returns all FOIA entries with lang and slug params
- Back link with left arrow SVG
- StatusTracker at top
- Header: category label, h1 title, definition list (authority, legal basis, date filed — all mono)
- Prose body: rendered Markdown content
- Documents section: PDFViewer for request + response (if exists), `client:visible`
- ShareCite block
- Related requests section (if any): h2 + grid-2 of FOIACards

**Step 5: Commit**

```bash
git add src/pages/[lang]/foia/ src/components/StatusTracker.astro src/components/PDFViewer.tsx src/components/ShareCite.astro
git commit -m "feat: add FOIA detail page with status tracker, PDF viewer, share/cite"
```

---

## Task 9: Article Detail Page

**Files:**
- Create: `src/pages/[lang]/articles/[slug].astro`

**Step 1: Create article detail page**

Create `src/pages/[lang]/articles/[slug].astro`:
- `getStaticPaths()`: returns all article entries
- Back link to `/${lang}/#articles`
- Header: category label, h1 title, meta row (mono date + reading time)
- Prose body: rendered Markdown content
- ShareCite block
- Related articles (if any)

Same layout structure as FOIA detail but without StatusTracker and PDFViewer.

**Step 2: Commit**

```bash
git add src/pages/[lang]/articles/
git commit -m "feat: add article detail page with reading time, share/cite, related articles"
```

---

## Task 10: Interactive Map — Preact Island with MapLibre GL

**Files:**
- Create: `src/components/MapIsland.js`

**Step 1: Create MapIsland module**

Create `src/components/MapIsland.js` — exports `initMap(container, foiaData)`:

```js
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export function initMap(container, foiaData) {
  const map = new maplibregl.Map({
    container,
    style: 'https://vectortiles.geo.admin.ch/styles/ch.swisstopo.basemap.vt/style.json',
    center: [8.2, 46.8],
    zoom: 7,
  });

  map.addControl(new maplibregl.NavigationControl(), 'top-right');

  // Convert to GeoJSON
  const geojson = {
    type: 'FeatureCollection',
    features: foiaData.map(f => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [f.lng, f.lat] },
      properties: { title: f.title, status: f.status, category: f.category, url: f.url, slug: f.slug },
    })),
  };

  map.on('load', () => {
    // Add clustered source
    map.addSource('foia', {
      type: 'geojson',
      data: geojson,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });

    // Cluster circles
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'foia',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#0a0a0a',
        'circle-radius': ['step', ['get', 'point_count'], 18, 5, 24, 10, 30],
      },
    });

    // Cluster count labels
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'foia',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-size': 12,
      },
      paint: { 'text-color': '#ffffff' },
    });

    // Individual points
    map.addLayer({
      id: 'points',
      type: 'circle',
      source: 'foia',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#0a0a0a',
        'circle-radius': 7,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
      },
    });

    // Click on point: show popup
    map.on('click', 'points', (e) => {
      const props = e.features[0].properties;
      new maplibregl.Popup({ offset: 12, closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(`
          <div style="font-family:Inter,sans-serif;font-size:14px;">
            <strong>${props.title}</strong><br/>
            <a href="${props.url}" style="color:#0a0a0a;text-decoration:underline;">View details</a>
          </div>
        `)
        .addTo(map);
    });

    // Click on cluster: zoom in
    map.on('click', 'clusters', (e) => {
      const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('foia').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.easeTo({ center: features[0].geometry.coordinates, zoom });
      });
    });

    // Cursor styles
    map.on('mouseenter', 'points', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'points', () => { map.getCanvas().style.cursor = ''; });
    map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });
  });
}
```

Note: popup HTML is constructed from our own FOIA data (titles and URLs from content collections), not from user input, so it's safe. The content is defined in our Markdown frontmatter.

**Step 2: Verify map renders**

```bash
npx astro dev
```

Open `http://localhost:4321/en/` and verify map loads with markers.

**Step 3: Commit**

```bash
git add src/components/MapIsland.js
git commit -m "feat: add interactive map with clustering, filters, and Swisstopo basemap"
```

---

## Task 11: Timeline Page and Component

**Files:**
- Create: `src/pages/[lang]/timeline.astro`
- Create: `src/components/Timeline.astro`

**Step 1: Create Timeline component**

Create `src/components/Timeline.astro`:
- Vertical timeline with thin left-side line (1px, `--border`)
- Each entry: status dot (12px circle, colored by status), date (mono, xs), title (h3 as link), one-line summary (muted, sm)
- Dot colors: green (responded/published), amber (acknowledged/submitted)
- Entries connected by the vertical line
- Spacing: `--space-8` between entries
- Props: `entries` (FOIA array, pre-sorted), `lang`

**Step 2: Create timeline page**

Create `src/pages/[lang]/timeline.astro`:
- `getStaticPaths()` for 4 langs
- Fetches and sorts FOIA by dateSubmitted ascending
- Renders: Header, section with label + h1 + Timeline component, Footer

**Step 3: Commit**

```bash
git add src/pages/[lang]/timeline.astro src/components/Timeline.astro
git commit -m "feat: add timeline page with chronological FOIA visualization"
```

---

## Task 12: Search — Pagefind Integration

**Files:**
- Create: `src/components/Search.tsx` (Preact island)
- Modify: `src/components/Header.astro` (wire search trigger)
- Modify: `src/layouts/Base.astro` (add pagefind attributes)

**Step 1: Pagefind indexing is already configured**

The `postbuild` script in `package.json` runs `npx pagefind --site dist`. The `data-pagefind-body` on `<main>` in Base.astro ensures only content is indexed.

**Step 2: Create Search Preact island**

Create `src/components/Search.tsx`:
- Opens as modal overlay (full-screen on mobile, centered card on desktop)
- Text input with search icon and placeholder
- Lazy-loads Pagefind JS on first open
- Debounced search: fires after 2+ characters
- Results: list of links with title + text excerpt (rendered as text content, NOT innerHTML — use `textContent` extraction from Pagefind excerpts for safety, or sanitize with a simple tag stripper)
- Grouped by content type if possible
- "No results" message when query returns empty
- Keyboard: `/` opens, `Escape` closes, arrow keys navigate results
- Props: `placeholder`, `noResults`, `resultsLabel` (from i18n)

**Step 3: Wire search in Header and Base**

- In Header: `.search-trigger` button dispatches a custom event `open-search`
- In Base.astro: include `<Search client:idle ... />` and listen for the custom event
- Add `data-pagefind-ignore` to `<header>` and `<footer>` elements

**Step 4: Verify search works**

```bash
npm run build && npx astro preview
```

**Step 5: Commit**

```bash
git add src/components/Search.tsx src/layouts/Base.astro src/components/Header.astro
git commit -m "feat: add Pagefind search with keyboard shortcut and modal UI"
```

---

## Task 13: RSS Feed and Data Export

**Files:**
- Create: `src/pages/rss.xml.ts`
- Create: `src/pages/data.json.ts`

**Step 1: Create RSS feed**

Create `src/pages/rss.xml.ts`:
- Astro API route (`GET` export)
- Fetches English FOIA + articles
- Generates RSS 2.0 XML with `atom:link` self-reference
- Each item: title (XML-escaped), link, description (XML-escaped), pubDate, guid
- Returns with `Content-Type: application/xml`

**Step 2: Create data export**

Create `src/pages/data.json.ts`:
- Astro API route (`GET` export)
- Fetches English FOIA entries
- Returns JSON object `{ foia: [...] }` with all metadata fields
- Returns with `Content-Type: application/json`

**Step 3: Commit**

```bash
git add src/pages/rss.xml.ts src/pages/data.json.ts
git commit -m "feat: add RSS feed and structured JSON data export"
```

---

## Task 14: Clean Up Old React Files and Final Polish

**Files:**
- Delete: old React source files (`src/index.js`, `src/App.js`, `src/i18n.js`, `src/translations.json`, `src/components/*.js`, `src/data/*.json`, `src/styles/global.css` old version)
- Delete: `docs/` build output (except `docs/plans/`)
- Update: `.gitignore`

**Step 1: Remove old files**

```bash
rm -f src/index.js src/App.js src/i18n.js src/translations.json
rm -f src/components/Header.js src/components/Intro.js src/components/FOIAList.js src/components/FOIADetail.js src/components/FOIADetails.js src/components/MapSection.js src/components/Articles.js src/components/ArticleDetail.js src/components/FeaturedArticles.js src/components/Contact.js src/components/Disclosures.js src/components/Footer.js
rm -rf src/data
rm -f docs/index.html docs/asset-manifest.json docs/favicon.svg docs/relief_switzerland_minimalist.png
rm -rf docs/static docs/data
```

**Step 2: Update .gitignore**

Add `dist/`, `.astro/` to `.gitignore`.

**Step 3: Full build and verify**

```bash
npm run build && npx astro preview
```

Verify all routes, features, responsive behavior, dark mode, search, RSS, data export, print styles.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: remove old React source, finalize Astro migration"
```

---

## Task 15: Deploy

**Step 1: Configure GitHub Pages source**

In repository Settings > Pages, set source to "GitHub Actions".

**Step 2: Push and deploy**

```bash
git push origin main
```

**Step 3: Verify live site at https://opengovclimate.ch**

Check: all 4 language routes, FOIA detail pages, article pages, map, timeline, search, dark mode, RSS, data export, mobile, print.

---

## Summary

| Task | Description | Commit Message |
|------|-------------|----------------|
| 1 | Astro scaffold + GitHub Actions | `feat: scaffold Astro 5 project with Preact and GitHub Actions deploy` |
| 2 | Design system CSS | `feat: add design system with CSS tokens and global styles` |
| 3 | Base layout + dark mode | `feat: add Base layout with SEO meta, OG tags, dark mode toggle` |
| 4 | i18n system | `feat: add i18n system with 4-language translations` |
| 5 | Content Collections | `feat: add content collections for FOIAs and articles with Zod schemas` |
| 6 | Header + Footer | `feat: add Header and Footer components with nav, mobile menu, lang switcher` |
| 7 | Homepage sections | `feat: add homepage with hero, FOIA grid, articles, contact sections` |
| 8 | FOIA detail + features | `feat: add FOIA detail page with status tracker, PDF viewer, share/cite` |
| 9 | Article detail | `feat: add article detail page with reading time, share/cite, related articles` |
| 10 | Interactive map | `feat: add interactive map with clustering, filters, and Swisstopo basemap` |
| 11 | Timeline | `feat: add timeline page with chronological FOIA visualization` |
| 12 | Search | `feat: add Pagefind search with keyboard shortcut and modal UI` |
| 13 | RSS + data export | `feat: add RSS feed and structured JSON data export` |
| 14 | Cleanup + verify | `feat: remove old React source, finalize Astro migration` |
| 15 | Deploy | Push to main, verify live |
