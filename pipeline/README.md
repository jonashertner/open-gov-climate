# pipeline — the Swiss climate-compliance engine

Two modules that decide whether a public construction project can defensibly be
said to breach a Swiss climate or energy obligation — and, far more often, that it
cannot.

```bash
cd pipeline
uv sync
uv run ruff check . && uv run ruff format --check . && uv run pyright && uv run pytest -q
```

No database, no network, no API keys, no runtime dependencies. Everything here is
a pure function over plain data.

## Why it is built this way

The output of this system is an allegation that a named public authority is acting
unlawfully. One wrong allegation is defamatory, is a DSG problem, and permanently
costs the project the credibility that makes it useful. So the engine is designed
around a single asymmetry: **a missed breach is cheap, a false accusation is not.**

Three decisions follow from that.

**Verdicts are three-valued.** A test against a public register has three
outcomes: the norm is met, the norm is breached, or *we cannot tell* — the GWR
heating column is null, the EGID never joined, the value arrived as a string where
a number was expected. Two-valued logic collapses the third case into "breached".
`Verdict` therefore has `TRUE`, `FALSE` and `UNKNOWN`, combined under Kleene logic,
and every route by which a value could fail to be understood yields `UNKNOWN`.

**Facts carry their own provenance.** `Fact` bundles the value with its dataset,
upstream field name, record ID and a timezone-aware retrieval time. There is no
way to hand a bare value to the evaluator, so there is no way to reach a verdict
that cannot be traced to a source. The evidential chain is a by-product of
evaluation rather than something written afterwards.

**The gate refuses by default.** `assess()` runs seven sequential gates and emits
a finding only if all seven pass. Each has its own `RefusalReason`, so every path
is separately testable:

| Gate | Refuses when |
|---|---|
| 1 Temporal | the obligation was not in force on the assessment date |
| 2 Norm integrity | the stored provision text no longer matches its hash |
| 3 Applicability | the norm does not apply, or we cannot tell |
| 4 Compliance | the norm is met, **or we cannot tell** |
| 5 Exemptions | an exemption applies, **or we cannot rule one out** |
| 6 Counterarguments | nothing could be said about how the finding might be wrong |
| 7 Route | the obligation names no enforcement route |

Gates 4 and 5 are the ones that earn the design. A null heating field refuses. An
unresolved statutory exception refuses. A `Refusal` is the *expected* outcome —
most subjects are simply compliant or out of scope — so it is a return value, not
an exception.

## The Befund

A finding carries the five components of a Swiss legal Subsumtion, and cannot be
constructed without them:

1. **Norm** — the provision verbatim, hash-checked
2. **Sachverhalt** — the facts read, each with dataset, record and retrieval time
3. **Subsumtion** — the evaluation trace, every premise citing a fact
4. **Gegenargument** — what would rebut it; *generated*, never empty
5. **Frist & Weg** — the enforcement route, plus the deadline once the
   Fristenrechner exists

`Befund.is_complete()` reports whether component 5 is whole. Until the
Fristenrechner lands a finding is informative but not filable, and the type system
says so rather than pretending otherwise.

Every Befund also carries its obligation's `Bindingness` — `justiciable`,
`programmatic` or `soft`. A finding resting on a Programmnorm labels itself
instead of borrowing the authority of a directly applicable rule.

## Deliberate limits

Ten operators (`eq ne in not_in lt lte gt gte present absent`), composed only with
`all` / `any` / `not`. No regex, no arithmetic, no user-defined functions. A rule
an author cannot read off one screen is a rule nobody reviews, and unreviewed rules
are how rules-as-code projects fail.

Type coercion is the **adapter's** job. Comparing `"7520"` against `7520` is
`UNKNOWN` here on purpose — guessing what the author meant is the behaviour this
module exists to prevent.

No language model is consulted anywhere. An LLM's later role is to render a trace
into prose; it does not decide whether there is a finding.

## What is not here yet

The obligation content, the ingest adapters, the database, and the deadline
arithmetic — all of which depend on field names and article numbers that must be
read off the primary sources. See [`../docs/sources.md`](../docs/sources.md) for
the verification register that gates them.

The illustrative Zürich heating rule used in the tests carries a **placeholder
article number**. Real citations come from the cantonal Rechtssammlung, never from
memory.
