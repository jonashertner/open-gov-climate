# Evidence Platform Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform opengovclimate.ch from a FOIA transparency tool into a litigation-grade environmental evidence platform covering Soil, Air, Forest, and Water domains.

**Architecture:** Replace the `foia` content collection with a unified `evidence` collection using an expanded Zod schema. Migrate 2 existing FOIA entries, add 4 new sample entries (one per domain). Update all pages, components, navigation, i18n, map, timeline, RSS, and data export. Full site-wide audit of every link, element, and page.

**Tech Stack:** Astro 5, Preact islands, MapLibre GL JS, Pagefind, Zod schemas, CSS custom properties

---

### Task 1: Define the Evidence Content Collection Schema

**Files:**
- Modify: `src/content.config.ts`

**Step 1: Replace the `foia` collection with `evidence` collection**

Replace the entire `foia` collection definition and add the new `evidence` collection. Keep `articles` unchanged.

```ts
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
```

**Step 2: Create the evidence content directory structure**

Run:
```bash
mkdir -p src/content/evidence/{en,de,fr,it}
```

**Step 3: Verify the schema compiles**

Run: `cd /Users/jonashertner/open-gov-climate && npx astro check 2>&1 | head -20`
Expected: May show errors about missing pages referencing `foia` — that's fine at this stage.

**Step 4: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: define evidence collection schema replacing foia"
```

---

### Task 2: Migrate Existing FOIA Content + Add 4 Domain Samples

**Files:**
- Create: `src/content/evidence/en/glacier-cooling-systems.md`
- Create: `src/content/evidence/en/high-altitude-solar.md`
- Create: `src/content/evidence/de/glacier-cooling-systems.md`
- Create: `src/content/evidence/de/high-altitude-solar.md`
- Create: `src/content/evidence/fr/glacier-cooling-systems.md`
- Create: `src/content/evidence/fr/high-altitude-solar.md`
- Create: `src/content/evidence/it/glacier-cooling-systems.md`
- Create: `src/content/evidence/it/high-altitude-solar.md`
- Create: `src/content/evidence/en/soil-pfas-contamination-thun.md`
- Create: `src/content/evidence/en/pm25-monitoring-zurich.md`
- Create: `src/content/evidence/en/forest-cover-loss-valais.md`
- Create: `src/content/evidence/en/groundwater-quality-aare.md`
- Create: same 4 new entries x DE, FR, IT (12 more files)

**Step 1: Migrate the 2 existing FOIA entries (EN) to evidence format**

For `src/content/evidence/en/glacier-cooling-systems.md`:
```markdown
---
slug: glacier-cooling-systems
lang: en
title: "Glacier Cooling Systems Study"
summary: "Research, funding reports and data on passive and active glacier-cooling methods over the past five years, including techniques like reflective covers, artificial snowmaking and shading."
status: published
dateSourced: 2024-08-15
dateVerified: 2024-10-03
datePublished: 2024-10-10
sourceType: foia
sourceAuthority: "Federal Office for the Environment (FOEN)"
sourceDocument: "/data/foia1_response.pdf"
acquisitionMethod: "BGO/FOIA request under BGO Art. 6"
citation: "Open Gov Climate. (2024). Glacier Cooling Systems Study. Federal Office for the Environment. Retrieved from https://opengovclimate.ch/en/evidence/glacier-cooling-systems/"
legalBasis: "BGO Art. 6"
legalProvisions: ["BGO Art. 6", "BGO Art. 10"]
jurisdiction: federal
coordinates: { lat: 46.8, lng: 8.3 }
canton: "OW"
siteName: "Central Swiss Alps"
measurementStart: 2019-01-01
measurementEnd: 2024-06-30
acquisitionDate: 2024-08-15
lastVerifiedDate: 2024-10-03
domain: air
subdomain: "Glacier cooling / cryosphere"
metrics: "Temperature reduction (C), ice mass preserved (m3)"
dataFormat: pdf
files:
  - { label: "FOIA Request", url: "/data/foia1_request.pdf", format: "pdf" }
  - { label: "FOIA Response", url: "/data/foia1_response.pdf", format: "pdf" }
requestPdf: /data/foia1_request.pdf
responsePdf: /data/foia1_response.pdf
relatedSlugs: [high-altitude-solar]
---

Please provide all documentation on glacier-cooling research funded in the last five years, including studies on passive and active techniques such as reflective blankets, artificial snowmaking and shading.

**Response:** Attached are the funding reports and research datasets for the requested glacier-cooling projects.
```

For `src/content/evidence/en/high-altitude-solar.md` — same pattern, adapting frontmatter from the existing FOIA entry.

**Step 2: Create 4 new sample evidence entries (EN only first)**

`src/content/evidence/en/soil-pfas-contamination-thun.md` (domain: soil):
```markdown
---
slug: soil-pfas-contamination-thun
lang: en
title: "PFAS Soil Contamination Near Thun Military Airfield"
summary: "Soil analysis results showing PFOS/PFOA contamination levels in agricultural land adjacent to the Thun military airfield, exceeding federal remediation thresholds."
status: verified
dateSourced: 2025-06-12
dateVerified: 2025-09-01
sourceType: government-report
sourceAuthority: "Canton of Bern, Office for Water and Waste (AWA)"
sourceDocument: "AWA Technical Report 2025-034"
acquisitionMethod: "Public dataset published by Canton of Bern"
citation: "Canton of Bern AWA. (2025). PFAS Soil Analysis Thun Military Airfield Perimeter (Report 2025-034). Retrieved from https://opengovclimate.ch/en/evidence/soil-pfas-contamination-thun/"
legalBasis: "USG Art. 32e"
legalProvisions: ["USG Art. 32e", "AltlV Art. 9", "AltlV Art. 12"]
jurisdiction: cantonal
coordinates: { lat: 46.7584, lng: 7.6280 }
canton: "BE"
municipality: "Thun"
siteName: "Thun Military Airfield perimeter"
measurementStart: 2024-03-15
measurementEnd: 2024-11-30
collectionDate: 2025-01-15
authorityPublicationDate: 2025-05-20
acquisitionDate: 2025-06-12
lastVerifiedDate: 2025-09-01
domain: soil
subdomain: "PFAS contamination"
metrics: "PFOS: 12.4 ug/kg (threshold: 2 ug/kg), PFOA: 8.1 ug/kg (threshold: 2 ug/kg)"
dataFormat: pdf
files:
  - { label: "AWA Report 2025-034", url: "/data/pfas-thun-report.pdf", format: "pdf" }
  - { label: "Soil Sample Results (CSV)", url: "/data/pfas-thun-samples.csv", format: "csv" }
relatedSlugs: []
---

Soil samples collected from 24 locations within a 500m radius of the Thun military airfield show PFOS concentrations averaging 12.4 ug/kg — over six times the federal remediation threshold of 2 ug/kg established under AltlV Art. 9.

The Canton of Bern's Office for Water and Waste (AWA) published these findings in Technical Report 2025-034, confirming that perfluorinated compounds from legacy use of AFFF firefighting foam have contaminated surrounding agricultural land.

## Key Findings

- **24 sample sites** within 500m perimeter
- **PFOS average:** 12.4 ug/kg (threshold: 2 ug/kg)
- **PFOA average:** 8.1 ug/kg (threshold: 2 ug/kg)
- **Deepest contamination:** 1.2m below surface
- **Affected area:** Approximately 18 hectares of agricultural land

## Legal Significance

Under USG Art. 32e and AltlV Art. 12, the polluter (Swiss military / armasuisse) bears remediation obligations. The canton has initiated formal remediation proceedings.
```

`src/content/evidence/en/pm25-monitoring-zurich.md` (domain: air):
```markdown
---
slug: pm25-monitoring-zurich
lang: en
title: "PM2.5 Exceedances in Zurich 2024"
summary: "Annual monitoring data from NABEL stations in Zurich showing 23 days exceeding WHO PM2.5 guidelines, with peak events linked to Saharan dust and temperature inversions."
status: published
dateSourced: 2025-02-01
dateVerified: 2025-03-15
datePublished: 2025-04-01
sourceType: monitoring-data
sourceAuthority: "FOEN / EMPA (NABEL network)"
sourceDocument: "NABEL Annual Report 2024"
acquisitionMethod: "Public dataset via FOEN Open Data portal"
citation: "FOEN/EMPA. (2024). NABEL Air Quality Monitoring: Zurich Stations Annual Report 2024. Retrieved from https://opengovclimate.ch/en/evidence/pm25-monitoring-zurich/"
legalBasis: "LRV Art. 2"
legalProvisions: ["LRV Art. 2", "LRV Annex 7", "USG Art. 11-13"]
jurisdiction: federal
coordinates: { lat: 47.3769, lng: 8.5417 }
canton: "ZH"
municipality: "Zurich"
siteName: "NABEL Zurich-Kaserne"
measurementStart: 2024-01-01
measurementEnd: 2024-12-31
collectionDate: 2025-01-20
authorityPublicationDate: 2025-01-31
acquisitionDate: 2025-02-01
lastVerifiedDate: 2025-03-15
domain: air
subdomain: "PM2.5"
metrics: "Annual mean: 11.2 ug/m3 (WHO guideline: 5 ug/m3), 23 exceedance days"
dataFormat: csv
files:
  - { label: "NABEL 2024 Report", url: "/data/nabel-zh-2024.pdf", format: "pdf" }
  - { label: "Hourly PM2.5 Data (CSV)", url: "/data/nabel-zh-pm25-2024.csv", format: "csv" }
relatedSlugs: []
---

The NABEL monitoring station Zurich-Kaserne recorded an annual mean PM2.5 concentration of 11.2 ug/m3 in 2024 — more than double the WHO guideline of 5 ug/m3. Twenty-three days exceeded the 24-hour WHO guideline of 15 ug/m3.

## Key Findings

- **Annual mean PM2.5:** 11.2 ug/m3 (WHO guideline: 5 ug/m3)
- **Exceedance days:** 23 days above WHO 24-hour guideline
- **Peak concentration:** 68.4 ug/m3 (February 14, during Saharan dust event)
- **Winter inversion events:** 8 multi-day episodes with sustained PM2.5 above 25 ug/m3

## Legal Significance

While Switzerland's national PM2.5 limit (LRV Annex 7) of 10 ug/m3 annual mean was exceeded, the WHO guideline of 5 ug/m3 — increasingly cited in Swiss litigation — was exceeded by a factor of 2.2. Under USG Art. 11-13, authorities must take precautionary measures to reduce emissions.
```

`src/content/evidence/en/forest-cover-loss-valais.md` (domain: forest):
```markdown
---
slug: forest-cover-loss-valais
lang: en
title: "Forest Cover Loss in Upper Valais 2020-2024"
summary: "Satellite-derived analysis showing 340 hectares of protective forest loss in Upper Valais due to bark beetle outbreaks exacerbated by drought, with implications for avalanche and rockfall protection."
status: verified
dateSourced: 2025-04-10
dateVerified: 2025-07-01
sourceType: academic-study
sourceAuthority: "WSL (Swiss Federal Institute for Forest, Snow and Landscape Research)"
sourceDocument: "WSL Research Paper 2025-11"
acquisitionMethod: "Published research, open access"
citation: "WSL. (2025). Protective Forest Decline in Upper Valais: Satellite Analysis 2020-2024 (Research Paper 2025-11). Retrieved from https://opengovclimate.ch/en/evidence/forest-cover-loss-valais/"
legalBasis: "WaG Art. 20"
legalProvisions: ["WaG Art. 20", "WaG Art. 35", "NHG Art. 18"]
jurisdiction: cantonal
coordinates: { lat: 46.3100, lng: 7.9800 }
canton: "VS"
municipality: "Visp"
siteName: "Upper Valais Rhone Valley corridor"
measurementStart: 2020-01-01
measurementEnd: 2024-12-31
collectionDate: 2025-02-28
acquisitionDate: 2025-04-10
lastVerifiedDate: 2025-07-01
domain: forest
subdomain: "Forest cover / protective forest"
metrics: "340 ha lost (4.2% of protective forest), 78% attributed to Ips typographus"
dataFormat: geojson
files:
  - { label: "WSL Paper 2025-11", url: "/data/wsl-valais-forest-2025.pdf", format: "pdf" }
  - { label: "Forest Loss Map (GeoJSON)", url: "/data/valais-forest-loss.geojson", format: "geojson" }
relatedSlugs: []
---

A WSL satellite analysis reveals that 340 hectares of designated protective forest in Upper Valais were lost between 2020 and 2024, representing a 4.2% decline. The primary driver was European spruce bark beetle (Ips typographus) outbreaks, whose severity was exacerbated by consecutive drought years.

## Key Findings

- **Total protective forest loss:** 340 hectares (4.2% of designated area)
- **Primary cause:** Bark beetle (Ips typographus) — 78% of loss area
- **Secondary causes:** Drought stress (15%), windthrow (7%)
- **Most affected elevation band:** 1,200-1,600m
- **Affected municipalities:** Visp, Stalden, Saas-Grund, Zermatt

## Legal Significance

Under WaG Art. 20, cantons must ensure the preservation of protective forests. WaG Art. 35 requires replacement when protective forest is lost. The 4.2% decline may constitute a failure to maintain protective forest functions for avalanche and rockfall mitigation, creating grounds for liability claims from affected communities.
```

`src/content/evidence/en/groundwater-quality-aare.md` (domain: water):
```markdown
---
slug: groundwater-quality-aare
lang: en
title: "Groundwater Nitrate Levels in Aare Valley"
summary: "NAQUA monitoring data revealing persistent nitrate contamination above 25 mg/L in 40% of Aare Valley groundwater wells, with agricultural runoff identified as primary source."
status: published
dateSourced: 2025-01-20
dateVerified: 2025-03-01
datePublished: 2025-03-15
sourceType: public-dataset
sourceAuthority: "FOEN (NAQUA national groundwater monitoring)"
sourceDocument: "NAQUA Bulletin 2024"
acquisitionMethod: "Public dataset via FOEN NAQUA portal"
citation: "FOEN. (2024). NAQUA National Groundwater Monitoring: Aare Valley Stations Bulletin 2024. Retrieved from https://opengovclimate.ch/en/evidence/groundwater-quality-aare/"
legalBasis: "GSchG Art. 22"
legalProvisions: ["GSchG Art. 22", "GSchG Art. 27", "GSchV Annex 2"]
jurisdiction: federal
coordinates: { lat: 47.0000, lng: 7.6300 }
canton: "BE"
municipality: "Bern"
siteName: "Aare Valley NAQUA network"
measurementStart: 2024-01-01
measurementEnd: 2024-12-31
collectionDate: 2025-01-10
authorityPublicationDate: 2025-01-15
acquisitionDate: 2025-01-20
lastVerifiedDate: 2025-03-01
domain: water
subdomain: "Groundwater quality / nitrate"
metrics: "40% of wells >25 mg/L NO3, max 62 mg/L (limit: 25 mg/L GSchV Annex 2)"
dataFormat: csv
files:
  - { label: "NAQUA Bulletin 2024", url: "/data/naqua-aare-2024.pdf", format: "pdf" }
  - { label: "Well Measurements (CSV)", url: "/data/naqua-aare-nitrate-2024.csv", format: "csv" }
relatedSlugs: []
---

The NAQUA national groundwater monitoring network recorded persistent nitrate contamination in the Aare Valley throughout 2024. Of the 15 monitored wells, 40% (6 wells) exceeded the federal quality criterion of 25 mg/L NO3 established in GSchV Annex 2.

## Key Findings

- **Wells exceeding limit:** 6 of 15 (40%) above 25 mg/L NO3
- **Maximum concentration:** 62 mg/L at Koppigen station
- **Annual mean (all stations):** 28.4 mg/L
- **Trend:** +3.2% year-over-year increase since 2020
- **Primary source:** Agricultural runoff (intensive crop cultivation)

## Legal Significance

Under GSchG Art. 22, authorities must ensure groundwater quality meets the requirements of GSchV Annex 2. The persistent exceedance — affecting 40% of wells — may constitute a violation of water protection obligations. Under GSchG Art. 27, cantons must designate protection zones and restrict activities that impair groundwater quality.
```

**Step 3: Create DE, FR, IT translations for all 6 entries**

Create translated versions of all 6 entries (2 migrated + 4 new) in `de/`, `fr/`, `it/` directories. Same slugs, translated `title`, `summary`, `citation`, and body content. Frontmatter fields like `sourceAuthority`, `legalBasis`, `acquisitionMethod` should be translated where appropriate.

**Step 4: Remove old FOIA content directory**

```bash
rm -rf src/content/foia/
```

**Step 5: Verify content loads**

Run: `cd /Users/jonashertner/open-gov-climate && npx astro build 2>&1 | tail -20`
Expected: Build errors about pages still referencing `foia` collection — that's expected, we fix those next.

**Step 6: Commit**

```bash
git add src/content/evidence/ src/content.config.ts
git rm -r src/content/foia/
git commit -m "feat: add evidence content with 6 entries (2 migrated FOIA + 4 new domains)"
```

---

### Task 3: Update i18n Translations

**Files:**
- Modify: `src/i18n/translations.ts`

**Step 1: Replace FOIA keys with Evidence keys, add domain and provenance strings**

For each of the 4 languages, replace all `foia.*` keys with `evidence.*` keys and add new keys:

```
'nav.evidence': 'Evidence',
'hero.cta': 'View Evidence',
'hero.description': (updated to reflect evidence platform mission),
'evidence.label': 'Evidence',
'evidence.heading': 'Litigation-grade environmental evidence with full provenance',
'evidence.readMore': 'View evidence',
'evidence.backLink': 'All Evidence',
'evidence.status.sourced': 'Sourced',
'evidence.status.verified': 'Verified',
'evidence.status.published': 'Published',
'evidence.sourceType.foia': 'FOIA Request',
'evidence.sourceType.government-report': 'Government Report',
'evidence.sourceType.monitoring-data': 'Monitoring Data',
'evidence.sourceType.academic-study': 'Academic Study',
'evidence.sourceType.public-dataset': 'Public Dataset',
'evidence.domain.soil': 'Soil',
'evidence.domain.air': 'Air',
'evidence.domain.forest': 'Forest',
'evidence.domain.water': 'Water',
'evidence.provenance': 'Provenance',
'evidence.legalCitation': 'Legal Citation',
'evidence.copyCitation': 'Copy Citation',
'evidence.location': 'Location',
'evidence.measurementPeriod': 'Measurement Period',
'evidence.files': 'Documents & Data',
'evidence.relatedEvidence': 'Related Evidence',
'evidence.jurisdiction.federal': 'Federal',
'evidence.jurisdiction.cantonal': 'Cantonal',
'evidence.jurisdiction.municipal': 'Municipal',
'evidence.filterDomain': 'Domain',
'evidence.filterSource': 'Source Type',
'evidence.filterCanton': 'Canton',
'evidence.allDomains': 'All Domains',
'evidence.allSources': 'All Sources',
'evidence.allCantons': 'All Cantons',
'search.placeholder': 'Search evidence and articles...',
'contact.description': (updated to reflect evidence platform),
```

Remove all `foia.*` keys. Remove `nav.foia`.

Translate all new keys into DE, FR, IT:
- DE: `'nav.evidence': 'Evidenz'`, `'evidence.domain.soil': 'Boden'`, `'evidence.domain.air': 'Luft'`, `'evidence.domain.forest': 'Wald'`, `'evidence.domain.water': 'Wasser'`, etc.
- FR: `'nav.evidence': 'Preuves'`, `'evidence.domain.soil': 'Sol'`, `'evidence.domain.air': 'Air'`, `'evidence.domain.forest': 'Foret'`, `'evidence.domain.water': 'Eau'`, etc.
- IT: `'nav.evidence': 'Prove'`, `'evidence.domain.soil': 'Suolo'`, `'evidence.domain.air': 'Aria'`, `'evidence.domain.forest': 'Foresta'`, `'evidence.domain.water': 'Acqua'`, etc.

**Step 2: Commit**

```bash
git add src/i18n/translations.ts
git commit -m "feat: update i18n with evidence keys replacing FOIA keys"
```

---

### Task 4: Create EvidenceCard Component

**Files:**
- Create: `src/components/EvidenceCard.astro`
- Delete: `src/components/FOIACard.astro`

**Step 1: Create EvidenceCard component**

```astro
---
import { t, type Lang } from '../i18n/utils';

interface Props { entry: any; lang: Lang; }
const { entry, lang } = Astro.props;
const { slug, title, summary, domain, sourceType, dateSourced, canton } = entry.data;

const domainColors: Record<string, string> = {
  soil: 'var(--domain-soil)',
  air: 'var(--domain-air)',
  forest: 'var(--domain-forest)',
  water: 'var(--domain-water)',
};
---

<article class="card">
  <div class="card__tags">
    <span class="badge" style={`background: ${domainColors[domain]}; color: #fff;`}>
      {t(lang, `evidence.domain.${domain}` as any)}
    </span>
    <span class="badge badge--outline">
      {t(lang, `evidence.sourceType.${sourceType}` as any)}
    </span>
  </div>
  <h3><a href={`/${lang}/evidence/${slug}/`}>{title}</a></h3>
  <p class="card__summary">{summary}</p>
  <div class="card__footer">
    <div class="card__meta">
      <span class="mono">{canton}</span>
      <time class="mono" datetime={dateSourced.toISOString().split('T')[0]}>
        {dateSourced.toISOString().split('T')[0]}
      </time>
    </div>
    <a href={`/${lang}/evidence/${slug}/`} class="card__link">
      {t(lang, 'evidence.readMore')}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
    </a>
  </div>
</article>

<style>
  .card__tags {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
  }
  .badge--outline {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .card h3 { margin-top: var(--space-3); }
  .card h3 a { text-decoration: none; }
  .card__summary {
    margin-top: var(--space-3);
    color: var(--muted);
    font-size: var(--text-sm);
    line-height: var(--leading-relaxed);
  }
  .card__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-4);
  }
  .card__meta {
    display: flex;
    gap: var(--space-3);
    color: var(--muted);
    font-size: var(--text-xs);
  }
  .card__link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: var(--text-sm);
    font-weight: 500;
    text-decoration: none;
  }
</style>
```

**Step 2: Add domain color CSS tokens**

Add to `src/styles/tokens.css`:
```css
--domain-soil: #8B6914;
--domain-air: #4A90D9;
--domain-forest: #2D7D46;
--domain-water: #1B6B93;
```

And dark mode variants:
```css
--domain-soil: #C49B2A;
--domain-air: #6BB3F0;
--domain-forest: #4CAF6E;
--domain-water: #3BA4D4;
```

**Step 3: Delete FOIACard**

```bash
rm src/components/FOIACard.astro
```

**Step 4: Commit**

```bash
git add src/components/EvidenceCard.astro src/styles/tokens.css
git rm src/components/FOIACard.astro
git commit -m "feat: add EvidenceCard component with domain colors"
```

---

### Task 5: Create Evidence Listing Page

**Files:**
- Create: `src/pages/[lang]/evidence/index.astro`

**Step 1: Create evidence listing page with filter bar**

This page shows all evidence entries for the current language with filter dropdowns for domain, source type, and canton. Use client-side JS for filtering (no page reloads).

```astro
---
import { getCollection } from 'astro:content';
import Base from '../../../layouts/Base.astro';
import Header from '../../../components/Header.astro';
import Footer from '../../../components/Footer.astro';
import EvidenceCard from '../../../components/EvidenceCard.astro';
import { t, type Lang } from '../../../i18n/utils';

export function getStaticPaths() {
  return [
    { params: { lang: 'en' } },
    { params: { lang: 'de' } },
    { params: { lang: 'fr' } },
    { params: { lang: 'it' } },
  ];
}

const { lang } = Astro.params as { lang: Lang };

const allEvidence = await getCollection('evidence');
const entries = allEvidence
  .filter(e => e.data.lang === lang)
  .sort((a, b) => b.data.dateSourced.getTime() - a.data.dateSourced.getTime());

const domains = ['soil', 'air', 'forest', 'water'];
const sourceTypes = [...new Set(entries.map(e => e.data.sourceType))];
const cantons = [...new Set(entries.map(e => e.data.canton))].sort();
---

<Base title={t(lang, 'evidence.label')} description={t(lang, 'evidence.heading')} lang={lang}>
  <Header slot="header" />

  <section class="section">
    <div class="container">
      <div class="section__header">
        <p class="label">{t(lang, 'evidence.label')}</p>
        <h1>{t(lang, 'evidence.heading')}</h1>
      </div>

      <div class="filter-bar" id="filter-bar">
        <select id="filter-domain" aria-label={t(lang, 'evidence.filterDomain')}>
          <option value="">{t(lang, 'evidence.allDomains')}</option>
          {domains.map(d => (
            <option value={d}>{t(lang, `evidence.domain.${d}` as any)}</option>
          ))}
        </select>
        <select id="filter-source" aria-label={t(lang, 'evidence.filterSource')}>
          <option value="">{t(lang, 'evidence.allSources')}</option>
          {sourceTypes.map(s => (
            <option value={s}>{t(lang, `evidence.sourceType.${s}` as any)}</option>
          ))}
        </select>
        <select id="filter-canton" aria-label={t(lang, 'evidence.filterCanton')}>
          <option value="">{t(lang, 'evidence.allCantons')}</option>
          {cantons.map(c => (
            <option value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div class="grid-2" id="evidence-grid">
        {entries.map(entry => (
          <div class="evidence-item" data-domain={entry.data.domain} data-source={entry.data.sourceType} data-canton={entry.data.canton}>
            <EvidenceCard entry={entry} lang={lang} />
          </div>
        ))}
      </div>
    </div>
  </section>

  <Footer slot="footer" />
</Base>

<style>
  .filter-bar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-3);
    margin-bottom: var(--space-8);
  }
  .filter-bar select {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-2) var(--space-4);
    border: 1px solid var(--border);
    background: var(--paper);
    color: var(--ink);
    min-height: 48px;
    cursor: pointer;
  }
</style>

<script>
  const grid = document.getElementById('evidence-grid');
  const items = grid?.querySelectorAll('.evidence-item') ?? [];
  const domainFilter = document.getElementById('filter-domain') as HTMLSelectElement;
  const sourceFilter = document.getElementById('filter-source') as HTMLSelectElement;
  const cantonFilter = document.getElementById('filter-canton') as HTMLSelectElement;

  function applyFilters() {
    const domain = domainFilter?.value || '';
    const source = sourceFilter?.value || '';
    const canton = cantonFilter?.value || '';

    items.forEach((item) => {
      const el = item as HTMLElement;
      const matchDomain = !domain || el.dataset.domain === domain;
      const matchSource = !source || el.dataset.source === source;
      const matchCanton = !canton || el.dataset.canton === canton;
      el.style.display = matchDomain && matchSource && matchCanton ? '' : 'none';
    });
  }

  domainFilter?.addEventListener('change', applyFilters);
  sourceFilter?.addEventListener('change', applyFilters);
  cantonFilter?.addEventListener('change', applyFilters);
</script>
```

**Step 2: Commit**

```bash
git add src/pages/[lang]/evidence/index.astro
git commit -m "feat: add evidence listing page with domain/source/canton filters"
```

---

### Task 6: Create Evidence Detail Page

**Files:**
- Create: `src/pages/[lang]/evidence/[slug].astro`
- Delete: `src/pages/[lang]/foia/[slug].astro`

**Step 1: Create evidence detail page**

This page replaces the FOIA detail page. It includes:
- Back link to evidence listing
- Status tracker (adapted for sourced/verified/published)
- Provenance block
- Legal citation block (copy-ready)
- Geolocation block
- Measurement period
- Body content
- File downloads
- Share/cite block
- Related evidence

```astro
---
import { getCollection, render } from 'astro:content';
import Base from '../../../layouts/Base.astro';
import Header from '../../../components/Header.astro';
import Footer from '../../../components/Footer.astro';
import ShareCite from '../../../components/ShareCite.astro';
import EvidenceCard from '../../../components/EvidenceCard.astro';
import { t, type Lang } from '../../../i18n/utils';

export async function getStaticPaths() {
  const entries = await getCollection('evidence');
  return entries.map(entry => ({
    params: { lang: entry.data.lang, slug: entry.data.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { lang } = Astro.params as { lang: Lang };
const { Content } = await render(entry);
const d = entry.data;

const allEvidence = await getCollection('evidence');
const related = allEvidence.filter(e =>
  e.data.lang === lang &&
  e.data.slug !== d.slug &&
  (d.relatedSlugs.includes(e.data.slug) || e.data.domain === d.domain)
).slice(0, 4);

const domainColors: Record<string, string> = {
  soil: 'var(--domain-soil)',
  air: 'var(--domain-air)',
  forest: 'var(--domain-forest)',
  water: 'var(--domain-water)',
};

function formatDate(date?: Date): string {
  if (!date) return '';
  return date.toISOString().split('T')[0];
}
---

<Base title={d.title} description={d.summary} lang={lang}>
  <Header slot="header" />

  <article class="evidence-detail container">
    <a href={`/${lang}/evidence/`} class="back-link">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
      {t(lang, 'evidence.backLink')}
    </a>

    <header class="evidence-detail__header">
      <div class="evidence-detail__tags">
        <span class="badge" style={`background: ${domainColors[d.domain]}; color: #fff;`}>
          {t(lang, `evidence.domain.${d.domain}` as any)}
        </span>
        <span class="badge badge--outline">
          {t(lang, `evidence.sourceType.${d.sourceType}` as any)}
        </span>
        <span class="badge badge--outline">
          {t(lang, `evidence.status.${d.status}` as any)}
        </span>
      </div>
      <h1>{d.title}</h1>
      <p class="evidence-detail__summary">{d.summary}</p>
    </header>

    <!-- Provenance Block -->
    <section class="evidence-block">
      <h2 class="evidence-block__title">{t(lang, 'evidence.provenance')}</h2>
      <dl class="evidence-meta">
        <div><dt>Source</dt><dd>{d.sourceAuthority}</dd></div>
        <div><dt>Acquisition</dt><dd>{d.acquisitionMethod}</dd></div>
        <div><dt>Sourced</dt><dd class="mono">{formatDate(d.dateSourced)}</dd></div>
        {d.dateVerified && <div><dt>Verified</dt><dd class="mono">{formatDate(d.dateVerified)}</dd></div>}
        {d.datePublished && <div><dt>Published</dt><dd class="mono">{formatDate(d.datePublished)}</dd></div>}
        {d.sourceDocument && <div><dt>Document</dt><dd>{d.sourceDocument}</dd></div>}
      </dl>
    </section>

    <!-- Legal Citation Block -->
    <section class="evidence-block">
      <h2 class="evidence-block__title">{t(lang, 'evidence.legalCitation')}</h2>
      <blockquote class="citation-block mono" id="citation-text">{d.citation}</blockquote>
      <dl class="evidence-meta">
        <div><dt>Legal Basis</dt><dd class="mono">{d.legalBasis}</dd></div>
        {d.legalProvisions.length > 0 && (
          <div><dt>Provisions</dt><dd class="mono">{d.legalProvisions.join(', ')}</dd></div>
        )}
        <div><dt>Jurisdiction</dt><dd>{t(lang, `evidence.jurisdiction.${d.jurisdiction}` as any)}</dd></div>
      </dl>
    </section>

    <!-- Location Block -->
    <section class="evidence-block">
      <h2 class="evidence-block__title">{t(lang, 'evidence.location')}</h2>
      <dl class="evidence-meta">
        <div><dt>Canton</dt><dd>{d.canton}</dd></div>
        {d.municipality && <div><dt>Municipality</dt><dd>{d.municipality}</dd></div>}
        {d.siteName && <div><dt>Site</dt><dd>{d.siteName}</dd></div>}
        <div><dt>Coordinates</dt><dd class="mono">{d.coordinates.lat}, {d.coordinates.lng}</dd></div>
      </dl>
    </section>

    <!-- Measurement Period -->
    {(d.measurementStart || d.measurementEnd) && (
      <section class="evidence-block">
        <h2 class="evidence-block__title">{t(lang, 'evidence.measurementPeriod')}</h2>
        <dl class="evidence-meta">
          {d.measurementStart && <div><dt>Start</dt><dd class="mono">{formatDate(d.measurementStart)}</dd></div>}
          {d.measurementEnd && <div><dt>End</dt><dd class="mono">{formatDate(d.measurementEnd)}</dd></div>}
          {d.metrics && <div><dt>Metrics</dt><dd class="mono">{d.metrics}</dd></div>}
        </dl>
      </section>
    )}

    <!-- Body Content -->
    <div class="prose">
      <Content />
    </div>

    <!-- File Downloads -->
    {d.files.length > 0 && (
      <section class="evidence-block">
        <h2 class="evidence-block__title">{t(lang, 'evidence.files')}</h2>
        <div class="file-list">
          {d.files.map(f => (
            <a href={f.url} class="file-link" download>
              <span class="file-label">{f.label}</span>
              <span class="file-format badge badge--outline">{f.format.toUpperCase()}</span>
            </a>
          ))}
        </div>
      </section>
    )}

    <ShareCite
      title={d.title}
      url={`https://opengovclimate.ch/${lang}/evidence/${d.slug}/`}
      date={d.dateSourced}
      lang={lang}
    />

    {related.length > 0 && (
      <section class="evidence-detail__related">
        <h2>{t(lang, 'evidence.relatedEvidence')}</h2>
        <div class="grid-2">
          {related.map(r => <EvidenceCard entry={r} lang={lang} />)}
        </div>
      </section>
    )}
  </article>

  <Footer slot="footer" />
</Base>

<style>
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    text-decoration: none;
    margin-bottom: var(--space-8);
  }
  .evidence-detail__header { margin-bottom: var(--space-8); }
  .evidence-detail__tags {
    display: flex;
    gap: var(--space-2);
    flex-wrap: wrap;
    margin-bottom: var(--space-4);
  }
  .badge--outline {
    background: none;
    border: 1px solid var(--border);
    color: var(--muted);
  }
  .evidence-detail__header h1 { margin-bottom: var(--space-3); }
  .evidence-detail__summary { color: var(--muted); max-width: var(--prose-width); }
  .evidence-block {
    border-top: 1px solid var(--border);
    padding-top: var(--space-6);
    margin-top: var(--space-6);
  }
  .evidence-block__title {
    font-size: var(--text-sm);
    font-weight: 600;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: var(--space-4);
  }
  .evidence-meta {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-6);
  }
  .evidence-meta dt {
    font-size: var(--text-xs);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
    text-transform: uppercase;
    color: var(--muted);
  }
  .evidence-meta dd { margin-top: var(--space-1); }
  .citation-block {
    font-size: var(--text-sm);
    padding: var(--space-4);
    border-left: 3px solid var(--border);
    margin-bottom: var(--space-4);
    line-height: var(--leading-relaxed);
  }
  .evidence-detail .prose { margin-top: var(--space-8); }
  .file-list { display: flex; flex-direction: column; gap: var(--space-3); }
  .file-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--border);
    text-decoration: none;
    color: var(--ink);
    min-height: 48px;
    transition: border-color var(--duration-fast) var(--ease);
  }
  .file-link:hover { border-color: var(--ink); }
  .evidence-detail__related { margin-top: var(--space-16); }
  .evidence-detail__related h2 { margin-bottom: var(--space-8); }
</style>
```

**Step 2: Delete old FOIA detail page**

```bash
rm src/pages/[lang]/foia/[slug].astro
rmdir src/pages/[lang]/foia/ 2>/dev/null || true
```

**Step 3: Commit**

```bash
git add src/pages/[lang]/evidence/
git rm src/pages/[lang]/foia/[slug].astro
git commit -m "feat: add evidence detail page, remove FOIA detail page"
```

---

### Task 7: Update Homepage

**Files:**
- Modify: `src/pages/[lang]/index.astro`
- Modify: `src/components/Hero.astro`

**Step 1: Update index.astro to use evidence collection**

Replace `getCollection('foia')` with `getCollection('evidence')`. Replace `FOIACard` import with `EvidenceCard`. Update section ID from `foia` to `evidence`. Update map data to include domain info. Update translation keys from `foia.*` to `evidence.*`.

**Step 2: Update Hero.astro**

Change the CTA link from `/${lang}/#foia` to `/${lang}/evidence/`. Update translation key from `hero.cta` (which now says "View Evidence").

**Step 3: Commit**

```bash
git add src/pages/[lang]/index.astro src/components/Hero.astro
git commit -m "feat: update homepage to use evidence collection"
```

---

### Task 8: Update Header Navigation & Footer

**Files:**
- Modify: `src/components/Header.astro`
- Modify: `src/components/Footer.astro`

**Step 1: Update Header nav links**

Change `navLinks` array:
```ts
const navLinks = [
  { key: 'nav.evidence' as const, href: `/${lang}/evidence` },
  { key: 'nav.map' as const, href: `/${lang}/#map` },
  { key: 'nav.timeline' as const, href: `/${lang}/timeline` },
  { key: 'nav.articles' as const, href: `/${lang}/articles` },
  { key: 'nav.contact' as const, href: `/${lang}/#contact` },
];
```

**Step 2: Update Footer links**

Change `footerLinks` array — replace `nav.foia` with `nav.evidence`, update href to `/evidence`.

**Step 3: Commit**

```bash
git add src/components/Header.astro src/components/Footer.astro
git commit -m "feat: update navigation for evidence platform"
```

---

### Task 9: Update Map with Domain Colors

**Files:**
- Modify: `src/components/MapIsland.js`
- Modify: `src/pages/[lang]/index.astro` (map data attributes)

**Step 1: Update map data passed from index.astro**

In index.astro, update the map data to include `domain` field:
```js
data-evidence={JSON.stringify(entries.map(e => ({
  slug: e.data.slug,
  title: e.data.title,
  lat: e.data.coordinates.lat,
  lng: e.data.coordinates.lng,
  domain: e.data.domain,
  sourceType: e.data.sourceType,
  url: `/${lang}/evidence/${e.data.slug}/`,
})))}
```

**Step 2: Update MapIsland.js**

- Rename source from `foia` to `evidence`
- Add domain-based colors for markers:
  ```js
  const domainColors = {
    soil: '#8B6914',
    air: '#4A90D9',
    forest: '#2D7D46',
    water: '#1B6B93',
  };
  ```
- Update circle paint to use `match` expression on `domain` property
- Update popup to show domain badge
- Update data attribute from `data-foia` to `data-evidence`
- Update variable names from `foia` to `evidence`

**Step 3: Commit**

```bash
git add src/components/MapIsland.js src/pages/[lang]/index.astro
git commit -m "feat: update map with domain-colored markers"
```

---

### Task 10: Update Timeline

**Files:**
- Modify: `src/pages/[lang]/timeline.astro`
- Modify: `src/components/Timeline.astro`

**Step 1: Update timeline page to use evidence collection**

Replace `getCollection('foia')` with `getCollection('evidence')`. Sort by `dateSourced` instead of `dateSubmitted`.

**Step 2: Update Timeline component**

- Use domain colors for dots instead of status colors
- Link to `/evidence/` instead of `/foia/`
- Use `dateSourced` instead of `dateSubmitted`
- Add domain badge to each entry

**Step 3: Commit**

```bash
git add src/pages/[lang]/timeline.astro src/components/Timeline.astro
git commit -m "feat: update timeline for evidence with domain colors"
```

---

### Task 11: Update StatusTracker for Evidence

**Files:**
- Modify: `src/components/StatusTracker.astro`

**Step 1: Update status steps**

Replace the 4-step FOIA pipeline (submitted/acknowledged/responded/published) with the 3-step evidence pipeline (sourced/verified/published). Update translation keys from `foia.status.*` to `evidence.status.*`. Update prop names from `dateSubmitted` etc. to `dateSourced`, `dateVerified`, `datePublished`.

**Step 2: Commit**

```bash
git add src/components/StatusTracker.astro
git commit -m "feat: update StatusTracker for evidence pipeline"
```

---

### Task 12: Update RSS Feed and Data Export

**Files:**
- Modify: `src/pages/rss.xml.ts`
- Modify: `src/pages/data.json.ts`

**Step 1: Update RSS feed**

Replace `getCollection('foia')` with `getCollection('evidence')`. Update URLs from `/foia/` to `/evidence/`. Update `pubDate` field to use `dateSourced`. Update RSS description to reflect evidence platform.

**Step 2: Update data.json**

Replace `getCollection('foia')` with `getCollection('evidence')`. Export full evidence schema fields instead of FOIA fields. Change output key from `{ foia: data }` to `{ evidence: data }`.

**Step 3: Commit**

```bash
git add src/pages/rss.xml.ts src/pages/data.json.ts
git commit -m "feat: update RSS and data export for evidence schema"
```

---

### Task 13: Full Site-Wide Audit

**Files:**
- All files — read and verify

**Step 1: Verify all internal links resolve**

Check every `href` in every component and page:
- `/${lang}/evidence/` exists
- `/${lang}/evidence/${slug}/` exists for all slugs
- `/${lang}/timeline` exists
- `/${lang}/articles/${slug}/` exists
- `/${lang}/#evidence` anchor exists on homepage
- `/${lang}/#map` anchor exists on homepage
- `/${lang}/#contact` anchor exists on homepage
- Footer links all resolve
- RSS feed link correct
- Data export link correct

**Step 2: Verify language switcher works on all pages**

The language switcher in Header.astro uses `currentPath` — verify it works on:
- Homepage
- Evidence listing
- Evidence detail pages
- Timeline
- Article detail pages

**Step 3: Verify search placeholder updated**

Confirm `search.placeholder` key is updated in all 4 languages.

**Step 4: Verify dark mode**

Check that domain colors have dark mode variants in tokens.css. Verify badge colors render correctly in dark mode.

**Step 5: Verify mobile menu**

Confirm mobile nav links point to evidence (not FOIA).

**Step 6: Build and verify no errors**

Run: `cd /Users/jonashertner/open-gov-climate && npx astro build`
Expected: Clean build with all evidence pages generated.

**Step 7: Verify page count**

Expected pages:
- 4 homepages (en, de, fr, it)
- 4 evidence listing pages
- 24 evidence detail pages (6 entries x 4 languages)
- 4 article detail pages
- 4 timeline pages
- 1 root redirect
- 1 RSS
- 1 data.json
= ~43 pages

**Step 8: Commit any fixes found during audit**

```bash
git add -A
git commit -m "fix: site-wide audit fixes"
```

---

### Task 14: Deploy

**Step 1: Push to main**

```bash
git push origin main
```

**Step 2: Verify deployment**

Check GitHub Actions workflow completes. Verify site is live at https://opengovclimate.ch.

**Step 3: Verify live site**

- Homepage loads with Evidence section
- Evidence listing page with filters works
- Evidence detail pages load correctly
- Map shows domain-colored markers
- Timeline shows domain-colored dots
- Language switcher works on all pages
- Search finds evidence entries
- RSS feed includes evidence entries
- Data export includes evidence schema
- Dark mode works on all pages
- Mobile menu links correct
