"""The Befund gate: norm plus facts, yielding a defensible finding or a refusal.

A *Befund* is the structure of a Swiss legal Subsumtion, and this module will only
emit one when every component is present:

1. **Norm** — the provision verbatim, checked against its hash so an upstream
   amendment surfaces as a refusal rather than a silently outdated allegation.
2. **Sachverhalt** — the facts actually read, each carrying its dataset, record
   and retrieval time.
3. **Subsumtion** — the evaluation trace, in which every premise cites a fact.
4. **Gegenargument** — what would rebut the finding. Never empty.
5. **Frist & Weg** — the enforcement route (and, once the Fristenrechner lands,
   the deadline).

`assess` is a pure function of seven sequential gates, each with its own refusal
reason so every path is separately testable. Two of them carry the design:

* **Gate 4** refuses when compliance is `UNKNOWN` — a null heating field must
  never become an allegation.
* **Gate 5** refuses when an exemption is `UNKNOWN` — an unresolved statutory
  exception is a reason to stay silent, not to publish.

Nothing here consults a language model. An LLM's later role is to render the
trace into prose; it does not decide whether there is a finding.
"""

from __future__ import annotations

import hashlib
from collections.abc import Callable, Sequence
from dataclasses import dataclass
from datetime import date, timedelta
from enum import Enum

from compliance.facts import Fact, FactSet
from compliance.predicate import Evaluation, Predicate, Step, Verdict, evaluate

__all__ = [
    "DEFAULT_STALENESS",
    "Befund",
    "Bindingness",
    "Confidence",
    "Counterargument",
    "CounterargumentGenerator",
    "Deadline",
    "Exemption",
    "NormComponent",
    "Obligation",
    "Refusal",
    "RefusalReason",
    "RouteComponent",
    "assess",
    "default_counterarguments",
    "hash_norm_text",
]

DEFAULT_STALENESS = timedelta(days=180)


class Bindingness(Enum):
    """How much legal weight the obligation actually carries.

    Carried onto every Befund so a finding resting on a Programmnorm — KlG Art. 10
    para. 4's "sollen anstreben", say — labels itself rather than borrowing the
    authority of a justiciable rule.
    """

    JUSTICIABLE = "justiciable"
    PROGRAMMATIC = "programmatic"
    SOFT = "soft"


class Confidence(Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class RefusalReason(Enum):
    NOT_IN_FORCE = "not_in_force"
    NORM_DRIFT = "norm_drift"
    NOT_APPLICABLE = "not_applicable"
    APPLICABILITY_UNKNOWN = "applicability_unknown"
    COMPLIANT = "compliant"
    COMPLIANCE_UNKNOWN = "compliance_unknown"
    EXEMPT = "exempt"
    EXEMPTION_UNRESOLVED = "exemption_unresolved"
    NO_COUNTERARGUMENT = "no_counterargument"
    NO_ROUTE = "no_route"


def hash_norm_text(norm_text: str) -> str:
    """Stable digest of a provision's verbatim text, for drift detection."""
    return hashlib.sha256(norm_text.encode("utf-8")).hexdigest()


@dataclass(frozen=True, slots=True)
class Exemption:
    """A statutory escape from the obligation.

    `what_would_prove_it` is not documentation — it becomes the Gegenargument
    text, so it must read as something an authority could actually produce.
    """

    id: str
    legal_basis: str
    description: str
    what_would_prove_it: str
    predicate: Predicate

    def __post_init__(self) -> None:
        for name in ("id", "legal_basis", "description", "what_would_prove_it"):
            if not getattr(self, name):
                raise ValueError(f"Exemption.{name} must be set")


@dataclass(frozen=True, slots=True)
class Obligation:
    """A single testable norm, hand-curated and reviewed."""

    id: str
    jurisdiction: str
    legal_basis: str
    source_uri: str
    norm_text: str
    norm_text_hash: str
    in_force_from: date
    bindingness: Bindingness
    bindingness_note: str
    applies_when: Predicate
    requires: Predicate
    enforcement_routes: tuple[str, ...]
    exemptions: tuple[Exemption, ...] = ()
    in_force_until: date | None = None

    def __post_init__(self) -> None:
        for name in (
            "id",
            "jurisdiction",
            "legal_basis",
            "source_uri",
            "norm_text",
            "norm_text_hash",
            "bindingness_note",
        ):
            if not getattr(self, name):
                raise ValueError(f"Obligation.{name} must be set")
        if self.in_force_until is not None and self.in_force_until < self.in_force_from:
            raise ValueError("Obligation.in_force_until precedes in_force_from")


@dataclass(frozen=True, slots=True)
class NormComponent:
    legal_basis: str
    source_uri: str
    norm_text: str
    in_force_from: date
    in_force_until: date | None


@dataclass(frozen=True, slots=True)
class Deadline:
    """Supplied by the Fristenrechner (Stage 4), never recalled."""

    due: date
    basis: str
    computed_from: str


@dataclass(frozen=True, slots=True)
class RouteComponent:
    routes: tuple[str, ...]
    deadline: Deadline | None


@dataclass(frozen=True, slots=True)
class Counterargument:
    kind: str
    text: str
    legal_basis: str | None = None


@dataclass(frozen=True, slots=True)
class Befund:
    """A finding that satisfies all five components of the contract."""

    obligation_id: str
    subject_ref: str
    norm: NormComponent
    facts: tuple[Fact, ...]
    subsumption: tuple[Step, ...]
    counterarguments: tuple[Counterargument, ...]
    route: RouteComponent
    bindingness: Bindingness
    bindingness_note: str
    confidence: Confidence
    assessed_as_of: date

    def is_complete(self) -> bool:
        """True once component 5 is whole — i.e. a deadline has been computed.

        Until the Fristenrechner lands, a Befund is legally informative but not
        yet filable, and this is the honest way to say so in the type system.
        """
        return self.route.deadline is not None


@dataclass(frozen=True, slots=True)
class Refusal:
    """Why no finding was emitted. Refusals are the expected outcome, not errors."""

    obligation_id: str
    subject_ref: str
    reason: RefusalReason
    detail: str
    trace: tuple[Step, ...] = ()


CounterargumentGenerator = Callable[
    [Obligation, Sequence[Step], Sequence[Fact], date, timedelta],
    tuple[Counterargument, ...],
]


def _facts_from(trace: Sequence[Step]) -> tuple[Fact, ...]:
    """The distinct facts a trace actually read, in first-seen order."""
    seen: dict[tuple[str, str, str], Fact] = {}
    for step in trace:
        fact = step.observed
        if isinstance(fact, Fact):
            seen.setdefault((fact.dataset, fact.record_id, fact.field), fact)
    return tuple(seen.values())


def _is_stale(fact: Fact, as_of: date, staleness: timedelta) -> bool:
    return (as_of - fact.retrieved_at.date()) > staleness


def default_counterarguments(
    obligation: Obligation,
    trace: Sequence[Step],
    facts: Sequence[Fact],
    as_of: date,
    staleness: timedelta,
) -> tuple[Counterargument, ...]:
    """Derive what could rebut this finding, from the obligation and the evidence.

    These are generated rather than authored so that component 4 of the contract
    holds by construction: there is no code path that produces a Befund without
    also stating how it could be wrong.
    """
    out: list[Counterargument] = []

    # Always true of any register-derived finding, and the most likely real rebuttal.
    datasets = sorted({f.dataset for f in facts})
    out.append(
        Counterargument(
            kind="register_limits",
            text=(
                "The finding rests on register data"
                + (f" ({', '.join(datasets)})" if datasets else "")
                + ". The authority may hold a permit, exemption decision, or updated "
                "record not reflected in those sources."
            ),
        )
    )

    for exemption in obligation.exemptions:
        out.append(
            Counterargument(
                kind="exemption",
                text=(
                    f"The authority may establish that {exemption.description}. "
                    f"That would be shown by {exemption.what_would_prove_it}."
                ),
                legal_basis=exemption.legal_basis,
            )
        )

    for fact in facts:
        if _is_stale(fact, as_of, staleness):
            out.append(
                Counterargument(
                    kind="staleness",
                    text=(
                        f"{fact.dataset}.{fact.field} was retrieved on "
                        f"{fact.retrieved_at.date().isoformat()} and may since have changed."
                    ),
                )
            )

    # An UNKNOWN leaf that did not change the verdict still marks a real gap.
    for step in trace:
        if step.verdict is Verdict.UNKNOWN:
            out.append(
                Counterargument(
                    kind="evidential_gap",
                    text=(
                        f"The condition '{step.condition.describe()}' could not be evaluated "
                        f"({step.reason}); it did not affect the outcome but is unverified."
                    ),
                )
            )

    if obligation.bindingness is not Bindingness.JUSTICIABLE:
        out.append(
            Counterargument(
                kind="bindingness",
                text=(
                    f"This obligation is graded '{obligation.bindingness.value}': "
                    f"{obligation.bindingness_note}"
                ),
                legal_basis=obligation.legal_basis,
            )
        )

    return tuple(out)


def _confidence_for(
    obligation: Obligation, facts: Sequence[Fact], as_of: date, staleness: timedelta
) -> Confidence:
    ladder = [Confidence.HIGH, Confidence.MEDIUM, Confidence.LOW]
    base = {
        Bindingness.JUSTICIABLE: 0,
        Bindingness.PROGRAMMATIC: 1,
        Bindingness.SOFT: 2,
    }[obligation.bindingness]
    if any(_is_stale(f, as_of, staleness) for f in facts):
        base += 1
    return ladder[min(base, len(ladder) - 1)]


def assess(
    obligation: Obligation,
    facts: FactSet,
    as_of: date,
    subject_ref: str,
    deadline: Deadline | None = None,
    staleness: timedelta = DEFAULT_STALENESS,
    counterargument_generator: CounterargumentGenerator = default_counterarguments,
) -> Befund | Refusal:
    """Assess one obligation against one subject's facts.

    Returns a `Befund` only when all seven gates pass; otherwise a `Refusal`
    naming the gate that stopped it. A `Refusal` is not an error — most subjects
    are simply compliant or out of scope.
    """

    def refuse(reason: RefusalReason, detail: str, trace: tuple[Step, ...] = ()) -> Refusal:
        return Refusal(obligation.id, subject_ref, reason, detail, trace)

    # Gate 1 — temporal. A norm cannot be breached before it exists.
    if as_of < obligation.in_force_from:
        return refuse(
            RefusalReason.NOT_IN_FORCE,
            f"in force from {obligation.in_force_from.isoformat()}, assessed {as_of.isoformat()}",
        )
    if obligation.in_force_until is not None and as_of > obligation.in_force_until:
        return refuse(
            RefusalReason.NOT_IN_FORCE,
            f"in force until {obligation.in_force_until.isoformat()}, assessed {as_of.isoformat()}",
        )

    # Gate 2 — norm integrity. If the stored text no longer matches its hash the
    # provision was amended upstream, and every predicate written against it is
    # suspect until a human re-reads it.
    if hash_norm_text(obligation.norm_text) != obligation.norm_text_hash:
        return refuse(
            RefusalReason.NORM_DRIFT,
            "stored norm text does not match its recorded hash; re-curate before relying on it",
        )

    # Gate 3 — applicability.
    applicability: Evaluation = evaluate(obligation.applies_when, facts)
    if applicability.verdict is Verdict.FALSE:
        return refuse(
            RefusalReason.NOT_APPLICABLE,
            "the obligation does not apply to this subject",
            applicability.trace,
        )
    if applicability.verdict is Verdict.UNKNOWN:
        gaps = "; ".join(s.describe() for s in applicability.unknown_steps())
        return refuse(
            RefusalReason.APPLICABILITY_UNKNOWN,
            f"cannot establish whether the obligation applies: {gaps}",
            applicability.trace,
        )

    # Gate 4 — compliance. UNKNOWN must never become an allegation.
    compliance: Evaluation = evaluate(obligation.requires, facts)
    if compliance.verdict is Verdict.TRUE:
        return refuse(
            RefusalReason.COMPLIANT,
            "the obligation is met",
            compliance.trace,
        )
    if compliance.verdict is Verdict.UNKNOWN:
        gaps = "; ".join(s.describe() for s in compliance.unknown_steps())
        return refuse(
            RefusalReason.COMPLIANCE_UNKNOWN,
            f"cannot establish compliance: {gaps}",
            compliance.trace,
        )

    # Gate 5 — exemptions. An unresolved exception is a reason to stay silent.
    exemption_trace: list[Step] = []
    for exemption in obligation.exemptions:
        result = evaluate(exemption.predicate, facts)
        exemption_trace.extend(result.trace)
        if result.verdict is Verdict.TRUE:
            return refuse(
                RefusalReason.EXEMPT,
                f"exemption {exemption.id} applies ({exemption.legal_basis})",
                tuple(exemption_trace),
            )
        if result.verdict is Verdict.UNKNOWN:
            gaps = "; ".join(s.describe() for s in result.unknown_steps())
            return refuse(
                RefusalReason.EXEMPTION_UNRESOLVED,
                f"cannot rule out exemption {exemption.id} ({exemption.legal_basis}): {gaps}",
                tuple(exemption_trace),
            )

    trace = applicability.trace + compliance.trace + tuple(exemption_trace)
    used_facts = _facts_from(trace)

    # Gate 6 — the Gegenargument component may not be empty.
    counterarguments = counterargument_generator(obligation, trace, used_facts, as_of, staleness)
    if not counterarguments:
        return refuse(
            RefusalReason.NO_COUNTERARGUMENT,
            "no counterargument could be derived; a finding must state how it could be wrong",
            trace,
        )

    # Gate 7 — there must be somewhere to take it.
    if not obligation.enforcement_routes:
        return refuse(
            RefusalReason.NO_ROUTE,
            "the obligation declares no enforcement route",
            trace,
        )

    return Befund(
        obligation_id=obligation.id,
        subject_ref=subject_ref,
        norm=NormComponent(
            legal_basis=obligation.legal_basis,
            source_uri=obligation.source_uri,
            norm_text=obligation.norm_text,
            in_force_from=obligation.in_force_from,
            in_force_until=obligation.in_force_until,
        ),
        facts=used_facts,
        subsumption=trace,
        counterarguments=counterarguments,
        route=RouteComponent(routes=obligation.enforcement_routes, deadline=deadline),
        bindingness=obligation.bindingness,
        bindingness_note=obligation.bindingness_note,
        confidence=_confidence_for(obligation, used_facts, as_of, staleness),
        assessed_as_of=as_of,
    )
