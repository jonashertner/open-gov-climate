from __future__ import annotations

import itertools
from datetime import UTC, date, datetime

import pytest

from compliance.facts import Fact, FactSet
from compliance.predicate import (
    OPERATORS,
    All,
    Any_,
    Condition,
    Not,
    Verdict,
    evaluate,
    kleene_and,
    kleene_not,
    kleene_or,
    predicate_from_json,
    referenced_fields,
)

T, F, U = Verdict.TRUE, Verdict.FALSE, Verdict.UNKNOWN
RETRIEVED = datetime(2026, 7, 27, tzinfo=UTC)


def fact(value: object, field: str = "genh1") -> Fact:
    return Fact(
        value=value, field=field.upper(), dataset="gwr", record_id="1", retrieved_at=RETRIEVED
    )


def facts(**kwargs: object) -> FactSet:
    return {k: fact(v, k) for k, v in kwargs.items()}


def verdict_of(condition: Condition, fs: FactSet) -> Verdict:
    return evaluate(condition, fs).verdict


# --- Kleene truth tables --------------------------------------------------


@pytest.mark.parametrize(
    ("a", "b", "expected"),
    [
        (T, T, T),
        (T, F, F),
        (T, U, U),
        (F, T, F),
        (F, F, F),
        (F, U, F),
        (U, T, U),
        (U, F, F),
        (U, U, U),
    ],
)
def test_kleene_and(a: Verdict, b: Verdict, expected: Verdict) -> None:
    assert kleene_and([a, b]) is expected


@pytest.mark.parametrize(
    ("a", "b", "expected"),
    [
        (T, T, T),
        (T, F, T),
        (T, U, T),
        (F, T, T),
        (F, F, F),
        (F, U, U),
        (U, T, T),
        (U, F, U),
        (U, U, U),
    ],
)
def test_kleene_or(a: Verdict, b: Verdict, expected: Verdict) -> None:
    assert kleene_or([a, b]) is expected


@pytest.mark.parametrize(("a", "expected"), [(T, F), (F, T), (U, U)])
def test_kleene_not(a: Verdict, expected: Verdict) -> None:
    """Negating ignorance yields ignorance — not knowing never becomes knowing."""
    assert kleene_not(a) is expected


def test_empty_conjunction_and_disjunction() -> None:
    assert kleene_and([]) is T
    assert kleene_or([]) is F


# --- operator matrix ------------------------------------------------------

MATCHING = [
    ("eq", "7520", "7520"),
    ("ne", "7520", "7510"),
    ("in", "7520", ["7510", "7520"]),
    ("not_in", "7520", ["7510", "7530"]),
    ("lt", 1980, 2000),
    ("lte", 2000, 2000),
    ("gt", 2010, 2000),
    ("gte", 2000, 2000),
]

NOT_MATCHING = [
    ("eq", "7520", "7510"),
    ("ne", "7520", "7520"),
    ("in", "7520", ["7510", "7530"]),
    ("not_in", "7520", ["7510", "7520"]),
    ("lt", 2010, 2000),
    ("lte", 2010, 2000),
    ("gt", 1980, 2000),
    ("gte", 1980, 2000),
]


@pytest.mark.parametrize(("op", "observed", "target"), MATCHING)
def test_operator_true_when_satisfied(op: str, observed: object, target: object) -> None:
    assert verdict_of(Condition("genh1", op, target), facts(genh1=observed)) is T


@pytest.mark.parametrize(("op", "observed", "target"), NOT_MATCHING)
def test_operator_false_when_not_satisfied(op: str, observed: object, target: object) -> None:
    assert verdict_of(Condition("genh1", op, target), facts(genh1=observed)) is F


@pytest.mark.parametrize(("op", "observed", "target"), MATCHING)
def test_missing_field_is_unknown_not_false(op: str, observed: object, target: object) -> None:
    """The single most important property in this module."""
    assert verdict_of(Condition("genh1", op, target), {}) is U


@pytest.mark.parametrize(("op", "observed", "target"), MATCHING)
def test_null_value_is_unknown_not_false(op: str, observed: object, target: object) -> None:
    """A null GWR column tells us nothing; it must not read as a breach."""
    assert verdict_of(Condition("genh1", op, target), facts(genh1=None)) is U


@pytest.mark.parametrize(
    ("op", "target"),
    [
        ("eq", 7520),
        ("ne", 7520),
        ("in", [7520]),
        ("not_in", [7520]),
        ("lt", 7520),
        ("lte", 7520),
        ("gt", 7520),
        ("gte", 7520),
    ],
)
def test_type_mismatch_is_unknown(op: str, target: object) -> None:
    """GWR codes are numeric-looking strings; "7520" vs 7520 must not silently decide."""
    assert verdict_of(Condition("genh1", op, target), facts(genh1="7520")) is U


def test_bool_is_not_a_number() -> None:
    assert verdict_of(Condition("flag", "eq", 1), facts(flag=True)) is U
    assert verdict_of(Condition("flag", "eq", True), facts(flag=True)) is T


def test_date_and_datetime_are_not_interchangeable() -> None:
    fs = {"d": fact(date(2026, 1, 1), "d")}
    assert verdict_of(Condition("d", "gt", datetime(2025, 1, 1, tzinfo=UTC)), fs) is U
    assert verdict_of(Condition("d", "gt", date(2025, 1, 1)), fs) is T


def test_unordered_types_refuse_ordered_comparison() -> None:
    fs = {"x": fact({"a": 1}, "x")}
    assert verdict_of(Condition("x", "gt", {"a": 0}), fs) is U


def test_empty_candidate_list_is_decided_not_unknown() -> None:
    assert verdict_of(Condition("genh1", "in", []), facts(genh1="7520")) is F
    assert verdict_of(Condition("genh1", "not_in", []), facts(genh1="7520")) is T


def test_membership_ignores_wrongly_typed_candidates_but_needs_one_match() -> None:
    assert verdict_of(Condition("genh1", "in", [7520, "7520"]), facts(genh1="7520")) is T
    assert verdict_of(Condition("genh1", "in", [7520, 7530]), facts(genh1="7520")) is U


# --- existence operators --------------------------------------------------


def test_present_and_absent_are_the_only_operators_decided_by_absence() -> None:
    assert verdict_of(Condition("genh1", "present"), facts(genh1="7520")) is T
    assert verdict_of(Condition("genh1", "present"), {}) is F
    assert verdict_of(Condition("genh1", "absent"), {}) is T
    assert verdict_of(Condition("genh1", "absent"), facts(genh1="7520")) is F


def test_a_null_value_counts_as_not_present() -> None:
    """ "present" means "we hold a usable value", which is what an author intends."""
    assert verdict_of(Condition("genh1", "present"), facts(genh1=None)) is F
    assert verdict_of(Condition("genh1", "absent"), facts(genh1=None)) is T


def test_every_declared_operator_is_reachable() -> None:
    covered = {op for op, _, _ in MATCHING} | set(("present", "absent"))
    assert covered == set(OPERATORS)


# --- construction guards --------------------------------------------------


def test_unknown_operator_is_rejected_at_construction() -> None:
    with pytest.raises(ValueError, match="unknown operator"):
        Condition("genh1", "matches", ".*")


def test_membership_requires_a_list() -> None:
    with pytest.raises(ValueError, match="requires a list"):
        Condition("genh1", "in", "7520")


# --- composition and trace ------------------------------------------------


def test_trace_is_complete_because_evaluation_does_not_short_circuit() -> None:
    """A partial trace would hide an unknown that the Gegenargument must surface."""
    predicate = All(
        (
            Condition("a", "eq", "no"),  # FALSE — would short-circuit a naive evaluator
            Condition("b", "eq", "yes"),  # UNKNOWN — missing
        )
    )
    result = evaluate(predicate, facts(a="yes"))
    assert result.verdict is F
    assert len(result.trace) == 2
    assert [s.verdict for s in result.trace] == [F, U]
    assert len(result.unknown_steps()) == 1


def test_nested_composition() -> None:
    predicate = Any_(
        (
            All((Condition("a", "eq", "1"), Condition("b", "eq", "2"))),
            Not(Condition("c", "eq", "3")),
        )
    )
    assert evaluate(predicate, facts(a="1", b="2", c="9")).verdict is T
    assert evaluate(predicate, facts(a="1", b="9", c="3")).verdict is F


def test_steps_carry_the_fact_that_was_read() -> None:
    result = evaluate(Condition("genh1", "eq", "7520"), facts(genh1="7520"))
    observed = result.trace[0].observed
    assert isinstance(observed, Fact)
    assert observed.dataset == "gwr"
    assert "GENH1" in observed.cite()


def test_referenced_fields_walks_the_whole_tree() -> None:
    predicate = All(
        (
            Condition("a", "present"),
            Any_((Condition("b", "eq", 1), Not(Condition("c", "eq", 2)))),
        )
    )
    assert referenced_fields(predicate) == frozenset({"a", "b", "c"})
    assert referenced_fields(All(())) == frozenset()


# --- JSON round trip ------------------------------------------------------


def test_predicate_from_json_parses_the_stored_shape() -> None:
    parsed = predicate_from_json(
        {
            "all": [
                {"field": "gkat", "op": "in", "value": ["1030"]},
                {"not": {"field": "genh1", "op": "eq", "value": "7520"}},
            ]
        }
    )
    assert parsed == All(
        (
            Condition("gkat", "in", ["1030"]),
            Not(Condition("genh1", "eq", "7520")),
        )
    )


def test_predicate_from_json_accepts_a_valueless_condition() -> None:
    assert predicate_from_json({"field": "egid", "op": "present"}) == Condition("egid", "present")


@pytest.mark.parametrize(
    "bad",
    [
        "not-an-object",
        {"all": {"field": "a", "op": "present"}},
        {"all": [], "any": []},
        {"not": {"field": "a", "op": "present"}, "field": "b"},
        {"op": "eq", "value": 1},
        {"field": "a", "op": "eq", "value": 1, "extra": True},
        {"field": 1, "op": "eq", "value": 1},
        {"field": "a", "op": "wat", "value": 1},
    ],
)
def test_predicate_from_json_rejects_malformed_input(bad: object) -> None:
    with pytest.raises(ValueError):
        predicate_from_json(bad)


def test_no_combination_of_verdicts_yields_true_from_all_unknown() -> None:
    """Sanity sweep: ignorance never manufactures a positive conclusion."""
    for combo in itertools.product([U], repeat=3):
        assert kleene_and(list(combo)) is U
        assert kleene_or(list(combo)) is U
