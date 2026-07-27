# Data sources — verification register

**Status: UNVERIFIED. Nothing here has been confirmed against a primary source.**

This is the Stage 0 work product for the Swiss climate-compliance pipeline. Every claim below was
assembled from search results only — the environment in which this file was drafted blocks
`fedlex.admin.ch`, `admin.ch`, `bfs.admin.ch`, `zh.ch`, `opendata.swiss` and `opencaselaw.ch` at the
network proxy (HTTP 403 on both `curl` and fetch). **No line of ingest code should be written
against any source until its block below is filled in from an unrestricted machine.**

How to use this file: work top to bottom. For each source, run the checks, paste the real answers
into the block, drop a sample payload into `pipeline/fixtures/<source>.json`, and change the block's
status to `VERIFIED <date>`. If a source fails, mark it `CUT <date> — reason`. Cutting a source in
Stage 0 is cheap; discovering it doesn't work in Stage 3 is not.

Legend: `?` = unknown · `~` = believed, unconfirmed · `!` = decision blocker

---

## S1 — Kanton Zürich, Baugesuche `!`

**Status:** UNVERIFIED
**Why it matters:** This is the wedge. It is the only source believed to expose building
applications *while the objection period is still open*, which is the entire product premise. If the
objection deadline is not derivable, the wedge changes shape.

| Field | Believed | Confirmed |
|---|---|---|
| Portal | opendata.swiss, dataset `baugesuche-im-kanton-zurich` ~ | |
| Publisher | Kanton Zürich, OGD-Koordinationsstelle ~ | |
| Coverage start | collected since autumn 2024; digital-only publication since 2019 ~ | |
| Key resource | *"Karte der Baugesuche innerhalb der Auflagefrist"* ~ | |
| Formats | ? | |
| Update cadence | ? | |
| Licence | ? | |
| API or file download | ? | |

**Checks to run**
1. Open the dataset page. List every resource with its format and direct URL.
2. Download the "Auflagefrist" resource. **Does a record carry the objection deadline, or only the
   publication date?** This is the single most important question in this file.
   - If the deadline is present → read it directly.
   - If only the publication date is present → the deadline must be *computed* (Stage 4), and the
     statutory basis for the ZH Einsprachefrist must be established and recorded here.
3. Record the exact field names for: application ID, title/description, Bauherrschaft, address,
   municipality, **EGID**, parcel, coordinates, publication date, status.
4. Is `EGID` present? If not, the GWR join (S3) needs an address- or coordinate-based match, which
   is materially less reliable — note that here.
5. Note the update cadence and whether records are ever retracted or amended (affects change
   detection in Stage 5).
6. Save one real record to `pipeline/fixtures/zh_baugesuche.json`.

---

## S2 — Basel-Stadt, Kantonsblatt Baupublikationen

**Status:** UNVERIFIED
**Why it matters:** Second wedge canton. Believed to be the cleanest API of the two.

| Field | Believed | Confirmed |
|---|---|---|
| Portal | `data.bs.ch` (Opendatasoft), dataset `100366` ~ | |
| JSON export | `https://data.bs.ch/api/v2/catalog/datasets/100366/exports/json` ~ | |
| Parquet export | same path with `/exports/parquet` ~ | |
| Contents | filtered from the Kantonsblatt dataset by sub-category "Baupublikationen"; carries Bauherrschaft, Projektverfasser, location; parcel coordinates enriched via GeoBS ~ | |
| Licence | ? | |
| Rate limits | ? (Opendatasoft APIs are usually rate-limited — find the actual limit) | |

**Checks to run**
1. `GET` the JSON export. Record the exact field names and one real record.
2. Opendatasoft also exposes a records API with filtering — find it, and prefer it over full exports
   for incremental polling.
3. **Is there an objection deadline field?** Same question as S1.
4. Confirm the licence — Opendatasoft portals often carry per-dataset terms distinct from the
   portal default.
5. Save to `pipeline/fixtures/bs_baupublikationen.json`.

---

## S3 — GWR / RegBL (Eidg. Gebäude- und Wohnungsregister) `!`

**Status:** UNVERIFIED
**Why it matters:** The fact that makes a finding possible — the heat generator and its energy
source, per building. Without this there is no compliance test, only a list of building permits.

| Field | Believed | Confirmed |
|---|---|---|
| Merkmalskatalog | `gwr.admin.ch/catalog` ~ | |
| Data access portal | `madd.bfs.admin.ch` ~ | |
| Public subset defined by | Anhang 1 VGWR, Bewilligungsstufe A ~ | |
| Key fields | `GKAT` (Gebäudekategorie), `GKLAS` (Gebäudeklasse), `GBAUJ` (Baujahr), `GENH1`/`GENH2` (Energie-/Wärmequelle Heizung), `GWAERZH1` (Heizungsart) ~ | |
| Join key | `EGID` ~ | |

**Checks to run**
1. Open the Merkmalskatalog. **Transcribe the full value lists** for `GKAT`, `GKLAS`, `GENH1`,
   `GWAERZH1` into `pipeline/reference/gwr_codes.json`. The compliance predicates test these codes
   directly, so a wrong code mapping is a wrong finding.
2. **Are the heating fields in the public (level A) subset, or do they require a data-access
   request?** If a request is needed: start it now — approval lead time will otherwise gate Stage 2.
3. Establish the access mechanism: bulk CSV, an API, or a per-canton extract. Record the exact call.
4. **Coverage/quality:** what fraction of buildings actually have `GENH1` populated, and how stale
   is it? A field that is 40% null changes the finding logic from "is non-compliant" to "cannot be
   assessed" — which the Befund's refusal gate must handle explicitly.
5. Confirm whether ownership is derivable. Expectation: **it is not** — GWR carries no owner. If
   confirmed, `is_public_body` must be resolved via S6, and that becomes a reviewable field.
6. Note data-protection restrictions on redistribution (relevant to publishing findings at Stage 7).

---

## S4 — opencaselaw.ch (norm text)

**Status:** UNVERIFIED
**Why it matters:** Supplies the verbatim `norm_text_de` for every obligation. The Befund contract
forbids stating a norm's content from anywhere else.

| Field | Believed | Confirmed |
|---|---|---|
| MCP endpoint | `https://mcp.opencaselaw.ch` (Streamable HTTP + SSE) ~ | |
| REST API | `https://opencaselaw.ch/api/` ~ | |
| Coverage | ~5,510 federal acts + ~15,722 cantonal acts, article-level; ~972k decisions ~ | |
| Licence / reuse terms | ? | |

**Checks to run**
1. Retrieve the article-level text of one **cantonal** provision — a ZH Energiegesetz article — and
   record the exact call. Cantonal coverage at article granularity is the load-bearing assumption;
   federal-only coverage would force a lexfind or cantonal-Rechtssammlung fallback.
2. Is there a stable identifier per article, and can a **historical version** be requested (the norm
   as in force on a given date)? Stage 1 stores `in_force_from`/`in_force_until` and Stage 3 needs
   the version in force on the permit date.
3. Rate limits and whether server-to-server use is acceptable.
4. Since both projects are yours: decide whether to consume over HTTP or share the corpus directly.
   HTTP is assumed in the plan; a direct read would remove a failure mode.

---

## S5 — simap.ch (public procurement)

**Status:** UNVERIFIED
**Why it matters:** The procurement route — the officially recognised lever for KlG Art. 10 — needs
tender and award data. Lower priority than S1–S3: the wedge does not depend on it.

| Field | Believed | Confirmed |
|---|---|---|
| Platform | relaunched 1 July 2024; an API exists ~ | |
| Open to third parties? | **unknown — may be partner-only** ! | |
| Fields needed | contracting authority, CPV codes, award criteria text, value, deadlines, award notices | |

**Checks to run**
1. Establish whether the API is publicly accessible or requires a partner agreement. If partner-only,
   record what the alternative is (scraping the publication pages, or the federal
   `beschaffung.admin.ch` subset) and its terms.
2. Identify the CPV codes covering construction, heating and HVAC.
3. Licence and terms of use for republication.

---

## S6 — Public-body identification `!`

**Status:** UNVERIFIED — **no source identified yet**
**Why it matters:** Deciding that a project is *public* is what makes the whole product's claim
land. A wrong "this is a public project" is the most likely route to an embarrassing false finding,
and there is no single dataset that answers it.

**Checks to run**
1. BFS UID-Register — is there a public API, and does it expose a legal-form or sector field that
   distinguishes public bodies? Record the call.
2. Zefix API — same question.
3. Neither will cover school districts, Gemeinde building departments, or cantonal real-estate arms
   cleanly. Plan for a **curated allowlist** per wedge canton, seeded by hand, and treat the flag as
   reviewable rather than derived.
4. Decide and record the fallback: when `is_public_body` is uncertain, the finding must not be
   emitted — refusal, not a guess.

---

## Legal groundwork (blocks Stage 1 and Stage 4, not Stage 0)

These are not data sources but must be established before the obligation register is seeded. **The
plan deliberately names rules and their effects but not their citations** — article numbers must be
read off the Rechtssammlung, never recalled.

1. **ZH heating rules** — the provision requiring a renewable heat generator on replacement (in
   force since 1 Sept 2022), the exemption (technically impossible, or >5% more expensive over the
   lifecycle), and the new-build self-generation requirement. Exact §§ of the Energiegesetz ZH and
   its Verordnung.
2. **BS** — the constitutional net-zero-2037 provision (Nov 2022 vote), the administration's
   net-zero-2030 commitment and *its legal form* (Regierungsrat decision vs statute — this decides
   the bindingness grade), and the status of the oil-heating ban.
3. **KlG Art. 10** — verbatim text of all paragraphs. Confirm the reading that para. 4 uses
   *"sollen anstreben"* for cantons and federal-affiliated firms; that wording is the basis for
   grading it `programmatic`.
4. **Objection deadlines** — the Einsprachefrist for ZH and for BS, each with its statutory basis,
   plus how the period is triggered (publication date? posting?).
5. **Fristenstillstand** — Art. 22a VwVG and Art. 46 BGG suspension periods, and whether they apply
   to cantonal building-permit objections (often they do not — establish this per canton).
6. **Standing** — who may raise an energy-law defect against a public building. Expectation is that
   a non-neighbour Einsprache is inadmissible in most cantons and that Art. 55 USG attaches only to
   UVP-triggering projects. **If confirmed, Aufsichtsbeschwerde is the primary route and Stage 6
   should be scoped accordingly.**

---

## Ground rules carried over from the existing projects

- Identify the crawler with a contact-bearing User-Agent; throttle to ~1 request/second; cap
  concurrent downloads; back off exponentially on any error. This is the posture already committed
  to publicly by the sibling projects and should not be relaxed.
- Record `retrieved_at` and a `content_hash` on every ingested record — provenance is per-field and
  timezone-aware by convention.
- Store the verbatim upstream payload alongside the parsed fields, so a parsing change never
  requires a re-fetch.
