from __future__ import annotations

from collections.abc import Sequence
from datetime import UTC, date, datetime, timedelta

import pytest

from compliance.befund import (
    DEFAULT_STALENESS,
    Befund,
    Bindingness,
    Confidence,
    Counterargument,
    CounterargumentGenerator,
    Deadline,
    Exemption,
    Obligation,
    Refusal,
    RefusalReason,
    assess,
    default_counterarguments,
    hash_norm_text,
)
from compliance.facts import Fact, FactSet
from compliance.predicate import All, Condition, Not, Step

AS_OF = date(2026, 7, 27)
FRESH = datetime(2026, 7, 20, tzinfo=UTC)
STALE = datetime(2024, 1, 1, tzinfo=UTC)

# A stand-in shaped like the Zürich heating-replacement rule. The article number
# is deliberately fictional — real citations come from the Rechtssammlung at
# Stage 1, never from memory.
NORM_TEXT = (
    "Wird ein Wärmeerzeuger ersetzt, so ist er durch einen Wärmeerzeuger zu "
    "ersetzen, der erneuerbare Energien nutzt."
)

RENEWABLE = ["7410", "7420", "7430"]  # heat pump / wood / district heating (illustrative)


def fact(value: object, field: str, *, dataset: str = "gwr", retrieved: datetime = FRESH) -> Fact:
    return Fact(
        value=value,
        field=field.upper(),
        dataset=dataset,
        record_id="EGID-1234567",
        retrieved_at=retrieved,
    )


def factset(**kwargs: object) -> FactSet:
    return {k: fact(v, k) for k, v in kwargs.items()}


def obligation(**overrides: object) -> Obligation:
    base: dict[str, object] = {
        "id": "zh-heizungsersatz",
        "jurisdiction": "CH-ZH",
        "legal_basis": "§ 00 EnerG ZH (placeholder — verify at Stage 1)",
        "source_uri": "https://example.invalid/energ-zh",
        "norm_text": NORM_TEXT,
        "norm_text_hash": hash_norm_text(NORM_TEXT),
        "in_force_from": date(2022, 9, 1),
        "bindingness": Bindingness.JUSTICIABLE,
        "bindingness_note": "Directly applicable cantonal energy law.",
        "applies_when": All(
            (
                Condition("is_public_body", "eq", True),
                Condition("kind", "eq", "heat_generator_replacement"),
            )
        ),
        "requires": Condition("genh1", "in", RENEWABLE),
        "enforcement_routes": ("baugesuch_einsprache", "aufsichtsbeschwerde"),
    }
    base.update(overrides)
    return Obligation(**base)  # pyright: ignore[reportArgumentType]


BREACHING = {"is_public_body": True, "kind": "heat_generator_replacement", "genh1": "7520"}


def no_counterarguments(
    _obligation: Obligation,
    _trace: Sequence[Step],
    _facts: Sequence[Fact],
    _as_of: date,
    _staleness: timedelta,
) -> tuple[Counterargument, ...]:
    return ()


def run(
    ob: Obligation | None = None,
    *,
    facts: FactSet | None = None,
    deadline: Deadline | None = None,
    staleness: timedelta = DEFAULT_STALENESS,
    counterargument_generator: CounterargumentGenerator = default_counterarguments,
) -> Befund | Refusal:
    return assess(
        ob or obligation(),
        factset(**BREACHING) if facts is None else facts,
        AS_OF,
        subject_ref="zh/2026/0001",
        deadline=deadline,
        staleness=staleness,
        counterargument_generator=counterargument_generator,
    )


def refusal(result: Befund | Refusal) -> Refusal:
    assert isinstance(result, Refusal), f"expected a Refusal, got {result!r}"
    return result


def befund(result: Befund | Refusal) -> Befund:
    assert isinstance(result, Befund), f"expected a Befund, got {result!r}"
    return result


# --- the happy path -------------------------------------------------------


def test_a_clean_breach_produces_a_complete_befund() -> None:
    result = befund(run())
    assert result.obligation_id == "zh-heizungsersatz"
    assert result.subject_ref == "zh/2026/0001"
    assert result.norm.norm_text == NORM_TEXT  # component 1
    assert result.facts  # component 2
    assert result.subsumption  # component 3
    assert result.counterarguments  # component 4
    assert result.route.routes  # component 5 (route)
    assert result.confidence is Confidence.HIGH


def test_every_fact_carries_its_provenance() -> None:
    for f in befund(run()).facts:
        assert f.dataset and f.record_id and f.retrieved_at.tzinfo is not None


def test_every_subsumption_step_that_read_a_value_cites_a_fact() -> None:
    for step in befund(run()).subsumption:
        if step.observed is not None:
            assert isinstance(step.observed, Fact)


def test_deadline_is_absent_until_the_fristenrechner_supplies_one() -> None:
    assert befund(run()).is_complete() is False
    with_deadline = befund(run(deadline=Deadline(date(2026, 8, 15), "§ 00 PBG ZH", "publication")))
    assert with_deadline.is_complete() is True


# --- one test per refusal gate --------------------------------------------


def test_gate1_before_entry_into_force() -> None:
    ob = obligation(in_force_from=date(2027, 1, 1))
    assert refusal(run(ob)).reason is RefusalReason.NOT_IN_FORCE


def test_gate1_after_repeal() -> None:
    ob = obligation(in_force_from=date(2022, 9, 1), in_force_until=date(2025, 12, 31))
    assert refusal(run(ob)).reason is RefusalReason.NOT_IN_FORCE


def test_gate2_norm_drift() -> None:
    """An upstream amendment must surface as a refusal, not an outdated allegation."""
    r = refusal(run(obligation(norm_text_hash=hash_norm_text("something else"))))
    assert r.reason is RefusalReason.NORM_DRIFT


def test_gate3_not_applicable() -> None:
    fs = factset(**{**BREACHING, "is_public_body": False})
    assert refusal(run(facts=fs)).reason is RefusalReason.NOT_APPLICABLE


def test_gate3_applicability_unknown() -> None:
    fs = factset(kind="heat_generator_replacement", genh1="7520")  # is_public_body missing
    r = refusal(run(facts=fs))
    assert r.reason is RefusalReason.APPLICABILITY_UNKNOWN
    assert "is_public_body" in r.detail


def test_gate4_compliant() -> None:
    fs = factset(**{**BREACHING, "genh1": "7410"})
    assert refusal(run(facts=fs)).reason is RefusalReason.COMPLIANT


def test_gate4_compliance_unknown_is_the_one_that_matters() -> None:
    """A null heating field is the most common real case. It must never allege."""
    fs = factset(**{**BREACHING, "genh1": None})
    r = refusal(run(facts=fs))
    assert r.reason is RefusalReason.COMPLIANCE_UNKNOWN
    assert "null" in r.detail


def test_gate5_exempt() -> None:
    ob = obligation(
        exemptions=(
            Exemption(
                id="unverhaeltnismaessig",
                legal_basis="§ 00 Abs. 2 EnerG ZH",
                description="a renewable replacement is technically impossible",
                what_would_prove_it="the Fachbericht submitted with the application",
                predicate=Condition("technically_impossible", "eq", True),
            ),
        )
    )
    fs = factset(**{**BREACHING, "technically_impossible": True})
    assert refusal(run(ob, facts=fs)).reason is RefusalReason.EXEMPT


def test_gate5_exemption_unresolved_is_the_other_one_that_matters() -> None:
    """Not knowing whether an exception applies is a reason to stay silent."""
    ob = obligation(
        exemptions=(
            Exemption(
                id="unverhaeltnismaessig",
                legal_basis="§ 00 Abs. 2 EnerG ZH",
                description="a renewable replacement costs more than 5% extra over the lifecycle",
                what_would_prove_it="the Wirtschaftlichkeitsrechnung",
                predicate=Condition("lifecycle_cost_premium_pct", "gt", 5.0),
            ),
        )
    )
    r = refusal(run(ob))  # the cost fact was never observed
    assert r.reason is RefusalReason.EXEMPTION_UNRESOLVED
    assert "lifecycle_cost_premium_pct" in r.detail


def test_gate6_no_counterargument() -> None:
    r = refusal(run(counterargument_generator=no_counterarguments))
    assert r.reason is RefusalReason.NO_COUNTERARGUMENT


def test_gate7_no_route() -> None:
    assert refusal(run(obligation(enforcement_routes=()))).reason is RefusalReason.NO_ROUTE


def test_every_refusal_reason_is_covered_by_a_test() -> None:
    tested = {
        RefusalReason.NOT_IN_FORCE,
        RefusalReason.NORM_DRIFT,
        RefusalReason.NOT_APPLICABLE,
        RefusalReason.APPLICABILITY_UNKNOWN,
        RefusalReason.COMPLIANT,
        RefusalReason.COMPLIANCE_UNKNOWN,
        RefusalReason.EXEMPT,
        RefusalReason.EXEMPTION_UNRESOLVED,
        RefusalReason.NO_COUNTERARGUMENT,
        RefusalReason.NO_ROUTE,
    }
    assert tested == set(RefusalReason)


# --- the invariant --------------------------------------------------------


@pytest.mark.parametrize("dropped", sorted(BREACHING))
def test_dropping_any_load_bearing_fact_forces_a_refusal(dropped: str) -> None:
    """No Befund may rest on a fact we do not hold."""
    fs = factset(**{k: v for k, v in BREACHING.items() if k != dropped})
    assert isinstance(run(facts=fs), Refusal)


@pytest.mark.parametrize("dropped", sorted(BREACHING))
def test_nulling_any_load_bearing_fact_forces_a_refusal(dropped: str) -> None:
    fs = factset(**{**BREACHING, dropped: None})
    assert isinstance(run(facts=fs), Refusal)


def test_an_unknown_that_does_not_change_the_verdict_still_becomes_a_counterargument() -> None:
    """A definitive FALSE stands even beside an unknown — but the gap is disclosed."""
    ob = obligation(
        requires=All(
            (
                Condition("genh1", "in", RENEWABLE),  # FALSE — decisive
                Condition("pv_installed", "eq", True),  # UNKNOWN — missing
            )
        )
    )
    result = befund(run(ob))
    kinds = [c.kind for c in result.counterarguments]
    assert "evidential_gap" in kinds
    assert any("pv_installed" in c.text for c in result.counterarguments)


# --- counterarguments and confidence --------------------------------------


def test_a_befund_always_states_how_it_could_be_wrong() -> None:
    kinds = [c.kind for c in befund(run()).counterarguments]
    assert "register_limits" in kinds


def test_each_exemption_becomes_a_counterargument_carrying_its_legal_basis() -> None:
    ob = obligation(
        exemptions=(
            Exemption(
                id="e1",
                legal_basis="§ 00 Abs. 2 EnerG ZH",
                description="the replacement is disproportionate",
                what_would_prove_it="the Wirtschaftlichkeitsrechnung",
                predicate=Not(Condition("is_public_body", "eq", True)),  # FALSE here
            ),
        )
    )
    args = [c for c in befund(run(ob)).counterarguments if c.kind == "exemption"]
    assert len(args) == 1
    assert args[0].legal_basis == "§ 00 Abs. 2 EnerG ZH"
    assert "Wirtschaftlichkeitsrechnung" in args[0].text


def test_stale_evidence_is_disclosed_and_lowers_confidence() -> None:
    fs = {k: fact(v, k, retrieved=STALE) for k, v in BREACHING.items()}
    result = befund(run(facts=fs))
    assert "staleness" in [c.kind for c in result.counterarguments]
    assert result.confidence is Confidence.MEDIUM


def test_a_programmnorm_labels_itself_and_never_reads_as_high_confidence() -> None:
    ob = obligation(
        bindingness=Bindingness.PROGRAMMATIC,
        bindingness_note="KlG Art. 10 Abs. 4 uses 'sollen anstreben'.",
    )
    result = befund(run(ob))
    assert result.bindingness is Bindingness.PROGRAMMATIC
    assert result.confidence is Confidence.MEDIUM
    assert "bindingness" in [c.kind for c in result.counterarguments]


def test_soft_obligations_bottom_out_at_low_confidence() -> None:
    ob = obligation(bindingness=Bindingness.SOFT, bindingness_note="A political commitment.")
    fs = {k: fact(v, k, retrieved=STALE) for k, v in BREACHING.items()}
    assert befund(run(ob, facts=fs)).confidence is Confidence.LOW


def test_staleness_threshold_is_configurable() -> None:
    fs = {k: fact(v, k, retrieved=STALE) for k, v in BREACHING.items()}
    result = befund(run(facts=fs, staleness=timedelta(days=3650)))
    assert "staleness" not in [c.kind for c in result.counterarguments]
    assert result.confidence is Confidence.HIGH


# --- construction guards --------------------------------------------------


@pytest.mark.parametrize(
    "field", ["id", "legal_basis", "source_uri", "norm_text", "bindingness_note"]
)
def test_obligation_rejects_missing_identity_fields(field: str) -> None:
    with pytest.raises(ValueError, match=field):
        obligation(**{field: ""})


def test_obligation_rejects_inverted_validity_window() -> None:
    with pytest.raises(ValueError, match="precedes"):
        obligation(in_force_from=date(2026, 1, 1), in_force_until=date(2025, 1, 1))


def test_exemption_requires_what_would_prove_it() -> None:
    """It becomes the Gegenargument text, so it cannot be blank."""
    with pytest.raises(ValueError, match="what_would_prove_it"):
        Exemption(
            id="e",
            legal_basis="§ 1",
            description="d",
            what_would_prove_it="",
            predicate=Condition("a", "present"),
        )


def test_counterargument_is_frozen() -> None:
    c = Counterargument(kind="k", text="t")
    with pytest.raises(AttributeError):
        c.text = "other"  # pyright: ignore[reportAttributeAccessIssue]
