# opengovclimate.ch — World-Class Overhaul Design

## Overview

Full rebuild of opengovclimate.ch from React CRA to Astro 5, with elevated Swiss minimalist design, 9 new features, 4-language support, and GitHub Pages deployment.

## Architecture

- **Framework:** Astro 5, static output (`output: 'static'`)
- **Deployment:** GitHub Pages via GitHub Actions (build on push to main)
- **Interactive islands:** Preact (map, search, PDF viewer) — everything else is zero-JS HTML/CSS
- **Content:** Astro Content Collections with Zod schemas (Markdown/MDX)
- **i18n:** Astro built-in i18n routing (`/en/`, `/de/`, `/fr/`, `/it/`) — real URL paths, proper SEO
- **Search:** Pagefind (indexes at build time, works statically)
- **Map:** MapLibre GL via Preact island with Swisstopo basemaps

### File Structure

```
src/
  content/
    foia/              # FOIA entries as .md with frontmatter
    articles/          # Articles as .mdx
    config.ts          # Collection schemas (Zod)
  components/
    Map.tsx            # Preact island
    Search.tsx         # Preact island
    PDFViewer.tsx      # Preact island
    Timeline.astro
    FOIACard.astro
    StatusTracker.astro
    ShareCite.astro
    Header.astro
    Footer.astro
    DarkModeToggle.astro
  layouts/
    Base.astro         # HTML shell, meta, OG tags, dark mode
    Article.astro
    FOIA.astro
  pages/
    [lang]/
      index.astro
      foia/
        index.astro
        [slug].astro
      articles/
        index.astro
        [slug].astro
      timeline.astro
    rss.xml.ts
    data.json.ts       # Structured JSON export
  styles/
    global.css         # Design system
    tokens.css         # CSS custom properties
  i18n/
    translations.ts
```

## Design System

### Typography

- **Typeface:** Inter (400, 500, 600, 700) + JetBrains Mono (400) for data accents
- **Display (h1):** Inter 700, -0.035em tracking, optical sizing on
- **Headlines (h2-h3):** Inter 600, -0.025em tracking
- **Body:** Inter 400, clamp(16px, 1vw + 14px, 18px), line-height 1.6 desktop / 1.55 mobile
- **Captions/Labels:** Inter 500, 11px, 0.08em tracking, uppercase
- **Monospace (dates, refs):** JetBrains Mono 400
- **Fluid typography:** All sizes use clamp() for smooth scaling 320px to ultrawide

### Color

```
Light mode:
  --ink:          #0a0a0a
  --paper:        #fafafa
  --muted:        #6b6b6b
  --border:       #e5e5e5
  --accent:       #0a0a0a
  --surface:      #f0f0f0
  --status-green: #1a7a3a
  --status-amber: #b45309
  --status-red:   #b91c1c

Dark mode (prefers-color-scheme + toggle override):
  --ink:          #e5e5e5
  --paper:        #0a0a0a
  --muted:        #8b8b8b
  --border:       #262626
  --surface:      #141414
  (status colors lightened for contrast)
```

### Spacing

4px base unit. Scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px.

### Layout

- Max content width: 1120px
- Prose reading width: 660px (~65 characters)
- CSS Grid for page layouts
- Mobile-first: designs start at 320px, scale up
- Touch targets: 48px minimum throughout

### Micro-interactions

- Links: underline offset 3px, thickness 1px, opacity transition on hover
- Cards: no shadow, no border-radius, 1px top border, hover shifts text color
- No page transitions (instant navigation is the feature)
- Reduced motion respected via prefers-reduced-motion
- Print stylesheet: hides nav/map, adjusts type, shows URLs inline

## Pages

### Homepage

1. **Hero** — Large headline, one paragraph, one CTA. No background image. 1px full-width top accent line.
2. **FOIA grid** — 2-column desktop, 1-column mobile. Cards: status badge (mono pill), title, summary, monospace date, "Read more ->".
3. **Map** — Full-bleed. Swisstopo basemap. Clustered markers. Click -> popover with title + link. Filter pills above. Mobile: 70vh with floating chips.
4. **Timeline** — Horizontal scrollable on desktop, vertical on mobile. Date (mono), title, status dot (green/amber/red).
5. **Articles** — Editorial grid. Featured article spans 2 cols. Category, date, title, excerpt.
6. **Contact** — Email link, PGP note, ProtonMail mention. No form.
7. **Footer** — Nav, RSS, data export, language switcher, copyright, jonashertner.com.

### FOIA Detail

- Back link
- Status tracker: horizontal pipeline (Submitted -> Acknowledged -> Responded -> Published), current step highlighted, monospace dates
- Metadata: title, date filed, authority, legal basis
- Summary
- Inline PDF viewer with download fallback
- Share/cite block: copy APA citation, copy URL, share to Twitter/LinkedIn/email
- Related FOIAs

### Article Detail

- Back link
- Category label, date, reading time
- Full MDX content
- Share/cite block
- Related articles

### Timeline Page

- Full-page chronological view
- Filterable by status, category, year
- Vertical layout, generous spacing, expandable entries

### Search

- Triggered by `/` shortcut or search icon
- Modal overlay with instant Pagefind results
- Grouped by type (FOIAs, Articles)
- Highlighted matched terms
- Mobile: full-screen view

### Header

- Sticky, minimal
- Site name left, nav center, language switcher + search icon + dark mode toggle right
- Mobile: hamburger -> full-screen overlay with large touch targets
- Active section: dot or weight change, not color

## Features

1. **Full-text search** — Pagefind, built at build time, zero runtime cost
2. **Inline PDF viewer** — Embedded viewer for FOIA documents, download fallback
3. **Timeline view** — Chronological visualization of all FOIA activity
4. **Advanced map** — MapLibre GL, clustering, category/status filters, rich popups
5. **FOIA status tracker** — Visual pipeline on each FOIA detail page
6. **RSS feed** — `/rss.xml` with full content for FOIAs and articles
7. **Dark mode** — System preference default, manual toggle, localStorage persistence
8. **Data export** — `/data.json` structured dump of all FOIA metadata
9. **Share/cite buttons** — APA citation, URL copy, social sharing

## Responsive Breakpoints

- **320px-479px:** Mobile portrait. Single column. Full-screen overlays for search/nav.
- **480px-767px:** Mobile landscape / small tablet. Slightly wider margins.
- **768px-1023px:** Tablet. 2-column grids begin. Sidebar content moves inline.
- **1024px-1279px:** Small desktop. Full layout with comfortable spacing.
- **1280px+:** Full desktop. Max-width container, generous margins.

## SEO & Meta

- Proper `<title>` and `<meta description>` per page, per language
- Open Graph tags (title, description, image, type, url)
- Twitter Card tags
- Canonical URLs with hreflang alternates
- Structured data (JSON-LD) for articles and organization
- Sitemap.xml auto-generated by Astro

## Accessibility

- Semantic HTML throughout
- Skip-to-content link
- ARIA labels on all interactive elements
- Focus-visible outlines (2px, offset)
- 48px touch targets
- Color contrast AA minimum (AAA target for body text)
- Reduced motion support
- Screen reader tested navigation flow
- Alt text on all images
- Language attribute per page (`lang="en"`, etc.)

## Deployment

- GitHub Actions workflow: on push to main -> build Astro -> deploy to GitHub Pages
- CNAME file for opengovclimate.ch
- Build output to default Astro dist/ directory
- No server required — fully static
