# Evidence Platform Design — opengovclimate.ch

## Overview

Expand opengovclimate.ch from a FOIA transparency tool into a litigation-grade environmental evidence platform. Merge the existing FOIA section with new environmental data into a unified "Evidence" collection covering four domains: Soil, Air, Forest, and Water.

Every piece of evidence is citation-ready, geolocated, and has full temporal provenance — designed for lawyers and activists to cite in legal proceedings.

## Core Concept

One unified **Evidence** collection replaces the current FOIA collection. Each entry is a citable piece of evidence — whether sourced from a FOIA request, government report, monitoring dataset, or academic study. The existing 2 FOIA entries migrate into this collection.

Data sources: government APIs where available, FOIA for what's not public, manual curation to fill gaps. The platform publishes curated documents, reports, and datasets with strong metadata — not a real-time monitoring dashboard.

## Evidence Schema

### Core fields
- title, slug, lang, summary, body (Markdown)
- status: `sourced` | `verified` | `published`
- dateSourced, dateVerified, datePublished

### Source provenance
- sourceType: `foia` | `government-report` | `monitoring-data` | `academic-study` | `public-dataset`
- sourceAuthority: string (who produced it)
- sourceDocument: string (PDF/CSV/link)
- acquisitionMethod: string (BGO request, public API, manual collection)
- foiaReference: string (optional — slug of related FOIA request)

### Legal citation
- citation: string (pre-formatted APA-style citation)
- legalBasis: string (which law: CO2 Act, EPA, USG, GSchG, WaG, etc.)
- legalProvisions: string[] (specific articles)
- jurisdiction: `federal` | `cantonal` | `municipal`

### Geospatial
- coordinates: { lat, lng }
- canton: string
- municipality: string (optional)
- siteName: string (optional — e.g., monitoring station name)

### Temporal provenance
- measurementStart: date
- measurementEnd: date
- collectionDate: date
- authorityPublicationDate: date (optional)
- acquisitionDate: date
- lastVerifiedDate: date

### Environmental domain
- domain: `soil` | `air` | `forest` | `water`
- subdomain: string (e.g., PM2.5, groundwater, forest cover)
- metrics: string (key measurements with units)
- dataFormat: `pdf` | `csv` | `geojson` | `xlsx`
- files: { label, url, format }[] (multiple downloadable files)

### Backward compatibility
- requestPdf, responsePdf (kept for migrated FOIA entries)
- relatedSlugs: string[]

## Site Structure

### Navigation
**Before:** FOIA Requests | Geographic Coverage | Timeline | Articles | Get In Touch
**After:** Evidence | Map | Timeline | Articles | Get In Touch

### Evidence listing page (`/[lang]/evidence/`)
- Filter bar: domain (Soil, Air, Forest, Water), source type, canton, date range
- Sort: by date, by domain
- Cards: domain tag, title, source type badge, location, measurement period, citation indicator
- 2-column grid on desktop, 1-column on mobile

### Evidence detail page (`/[lang]/evidence/[slug]/`)
- Provenance block: source chain (who created, how obtained, when verified)
- Legal citation block: copy-ready citation, relevant laws
- Geolocation block: mini-map, canton, municipality, site name
- Measurement period: clear start/end dates
- Body content (Markdown)
- Document viewer (PDFs) + data file downloads (CSV, GeoJSON, etc.)
- Share/cite block (enhanced with legal citation copy)
- Related evidence (same domain, location, or legal basis)

### Map (enhanced)
- Markers colored by domain (4 colors: soil, air, forest, water)
- Filter by domain, source type
- Click reveals evidence summary + detail link
- Clustering by domain

### Timeline (enhanced)
- All evidence entries chronologically
- Filter by domain
- Color-coded dots by domain

### Articles
- Unchanged — long-form analysis referencing evidence entries

### RSS feed
- Includes all evidence entries

### Data export (`/data.json`)
- Exports full evidence schema

## i18n Updates

All 4 languages (EN, DE, FR, IT) updated:
- "FOIA Requests" → "Evidence" / "Evidenz" / "Preuves" / "Prove"
- New strings for domains, source types, provenance labels, legal citation UI
- Domain names: Soil/Boden/Sol/Suolo, Air/Luft/Air/Aria, Forest/Wald/Foret/Foresta, Water/Wasser/Eau/Acqua

## Content Migration

- 2 existing FOIA entries → evidence entries with sourceType: `foia`
- 4 new sample entries (one per domain) demonstrating full schema

## Site-Wide Review

Full audit of every element, page, and link:
- All internal links resolve
- Language switcher works on all pages
- Nav links consistent and correct
- Anchor links updated to new section IDs
- Search indexes evidence content
- OG tags and meta descriptions updated
- Dark mode correct on all pages
- Mobile menu links correct
- Print stylesheet covers evidence detail pages
- Footer links valid
- All translations complete
