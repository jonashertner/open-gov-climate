"""Three-valued predicate evaluation over provenance-bearing facts.

A compliance test against a public register has three outcomes, not two: the norm
is met, the norm is breached, or *we cannot tell* — because the register field is
null, the join failed, or the value arrived in a type nobody expected. Two-valued
logic collapses the third case into "breached", which is precisely how a tool
ends up alleging that a school is heated illegally when in truth the heating
field was empty.

So `Verdict` has three members and they combine under Kleene logic. Every route
by which a value could fail to be understood — missing key, null value, type
mismatch, incomparable operands — yields ``UNKNOWN`` rather than ``FALSE``. The
Befund gate then refuses on ``UNKNOWN``. Refusal is the safe direction, and it is
enforced here rather than left to the caller's diligence.

The deliberate limits: ten operators, no regex, no arithmetic, no user functions,
no nesting beyond all/any/not. A rule an author cannot read off one screen is a
rule nobody reviews, and unreviewed rules are how rules-as-code projects fail.

Type coercion is the *adapter's* job, not the evaluator's. Comparing the string
``"7520"`` against the integer ``7520`` is UNKNOWN here, on purpose: guessing
what the author meant is exactly the behaviour this module exists to prevent.
"""

from __future__ import annotations

from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum
from typing import Any, cast

from compliance.facts import FactSet

__all__ = [
    "OPERATORS",
    "All",
    "Any_",
    "Condition",
    "Evaluation",
    "Not",
    "Predicate",
    "Step",
    "Verdict",
    "evaluate",
    "kleene_and",
    "kleene_not",
    "kleene_or",
    "predicate_from_json",
    "referenced_fields",
]


class Verdict(Enum):
    """Kleene three-valued truth."""

    TRUE = "true"
    FALSE = "false"
    UNKNOWN = "unknown"


def kleene_and(verdicts: Sequence[Verdict]) -> Verdict:
    """FALSE dominates; UNKNOWN otherwise poisons; empty conjunction is TRUE."""
    if any(v is Verdict.FALSE for v in verdicts):
        return Verdict.FALSE
    if any(v is Verdict.UNKNOWN for v in verdicts):
        return Verdict.UNKNOWN
    return Verdict.TRUE


def kleene_or(verdicts: Sequence[Verdict]) -> Verdict:
    """TRUE dominates; UNKNOWN otherwise poisons; empty disjunction is FALSE."""
    if any(v is Verdict.TRUE for v in verdicts):
        return Verdict.TRUE
    if any(v is Verdict.UNKNOWN for v in verdicts):
        return Verdict.UNKNOWN
    return Verdict.FALSE


def kleene_not(verdict: Verdict) -> Verdict:
    """UNKNOWN is its own negation — not knowing does not become knowing."""
    if verdict is Verdict.TRUE:
        return Verdict.FALSE
    if verdict is Verdict.FALSE:
        return Verdict.TRUE
    return Verdict.UNKNOWN


# --- operators ------------------------------------------------------------

EQUALITY_OPERATORS = ("eq", "ne")
MEMBERSHIP_OPERATORS = ("in", "not_in")
ORDERED_OPERATORS = ("lt", "lte", "gt", "gte")
EXISTENCE_OPERATORS = ("present", "absent")

OPERATORS: tuple[str, ...] = (
    *EQUALITY_OPERATORS,
    *MEMBERSHIP_OPERATORS,
    *ORDERED_OPERATORS,
    *EXISTENCE_OPERATORS,
)


def _type_class(value: object) -> str:
    """Coarse type class used to decide whether two values may be compared.

    `bool` is checked before `int` and `datetime` before `date`, because each is a
    subclass of the other and conflating them silently changes meaning.
    """
    if value is None:
        return "none"
    if isinstance(value, bool):
        return "bool"
    if isinstance(value, (int, float)):
        return "number"
    if isinstance(value, str):
        return "string"
    if isinstance(value, datetime):
        return "datetime"
    if isinstance(value, date):
        return "date"
    if isinstance(value, (list, tuple)):
        return "sequence"
    return "other"


_ORDERED_CLASSES = frozenset({"number", "datetime", "date", "string"})


def _apply_ordered(op: str, left: Any, right: Any) -> bool:
    if op == "lt":
        return bool(left < right)
    if op == "lte":
        return bool(left <= right)
    if op == "gt":
        return bool(left > right)
    return bool(left >= right)


@dataclass(frozen=True, slots=True)
class Condition:
    """A single leaf test: ``<field> <op> <value>``."""

    field: str
    op: str
    value: object = None

    def __post_init__(self) -> None:
        if not self.field:
            raise ValueError("Condition.field must be set")
        if self.op not in OPERATORS:
            raise ValueError(f"unknown operator {self.op!r}; expected one of {list(OPERATORS)}")
        if self.op in MEMBERSHIP_OPERATORS and not isinstance(self.value, (list, tuple)):
            raise ValueError(f"operator {self.op!r} requires a list value")

    def describe(self) -> str:
        if self.op in EXISTENCE_OPERATORS:
            return f"{self.field} {self.op}"
        return f"{self.field} {self.op} {self.value!r}"


@dataclass(frozen=True, slots=True)
class All:
    """Conjunction. An empty conjunction is vacuously TRUE."""

    parts: tuple[Predicate, ...]


@dataclass(frozen=True, slots=True)
class Any_:
    """Disjunction. An empty disjunction is vacuously FALSE.

    Named with a trailing underscore so it does not shadow ``typing.Any``; the
    JSON key remains ``any``.
    """

    parts: tuple[Predicate, ...]


@dataclass(frozen=True, slots=True)
class Not:
    part: Predicate


Predicate = Condition | All | Any_ | Not


@dataclass(frozen=True, slots=True)
class Step:
    """One leaf evaluation, retained so a Subsumtion can quote its evidence."""

    condition: Condition
    verdict: Verdict
    observed: object  # the Fact that was read, or None when the field was absent
    reason: str

    def describe(self) -> str:
        return f"{self.condition.describe()} → {self.verdict.value} ({self.reason})"


@dataclass(frozen=True, slots=True)
class Evaluation:
    verdict: Verdict
    trace: tuple[Step, ...]

    def unknown_steps(self) -> tuple[Step, ...]:
        return tuple(s for s in self.trace if s.verdict is Verdict.UNKNOWN)


def _evaluate_condition(condition: Condition, facts: FactSet) -> Step:
    fact = facts.get(condition.field)

    # Existence operators are the only ones allowed to conclude anything from
    # absence. A null value counts as absent: the record had the column, but it
    # tells us nothing, and "we hold no usable value" is what an author means.
    if condition.op in EXISTENCE_OPERATORS:
        has_value = fact is not None and fact.value is not None
        if condition.op == "present":
            verdict = Verdict.TRUE if has_value else Verdict.FALSE
        else:
            verdict = Verdict.FALSE if has_value else Verdict.TRUE
        reason = "value held" if has_value else "no value held"
        return Step(condition, verdict, fact, reason)

    if fact is None:
        return Step(condition, Verdict.UNKNOWN, None, "field not in fact set")
    if fact.value is None:
        return Step(condition, Verdict.UNKNOWN, fact, "value is null")

    observed = fact.value
    observed_class = _type_class(observed)

    if condition.op in MEMBERSHIP_OPERATORS:
        # Guaranteed to be a list or tuple by Condition.__post_init__.
        members = cast("Sequence[object]", condition.value)
        if not members:
            verdict = Verdict.FALSE if condition.op == "in" else Verdict.TRUE
            return Step(condition, verdict, fact, "empty candidate list")
        if not any(_type_class(m) == observed_class for m in members):
            return Step(
                condition,
                Verdict.UNKNOWN,
                fact,
                f"type mismatch: observed {observed_class}, candidates are not",
            )
        contained = any(observed == m for m in members)
        if condition.op == "not_in":
            contained = not contained
        return Step(
            condition,
            Verdict.TRUE if contained else Verdict.FALSE,
            fact,
            "membership test",
        )

    target = condition.value
    target_class = _type_class(target)
    if observed_class != target_class:
        return Step(
            condition,
            Verdict.UNKNOWN,
            fact,
            f"type mismatch: observed {observed_class}, expected {target_class}",
        )

    if condition.op in EQUALITY_OPERATORS:
        equal = observed == target
        if condition.op == "ne":
            equal = not equal
        return Step(condition, Verdict.TRUE if equal else Verdict.FALSE, fact, "equality test")

    if observed_class not in _ORDERED_CLASSES:
        return Step(
            condition,
            Verdict.UNKNOWN,
            fact,
            f"{observed_class} values are not ordered",
        )
    try:
        outcome = _apply_ordered(condition.op, observed, target)
    except TypeError:  # defensive: an exotic type that passed the class check
        return Step(condition, Verdict.UNKNOWN, fact, "values are not comparable")
    return Step(condition, Verdict.TRUE if outcome else Verdict.FALSE, fact, "ordered comparison")


def evaluate(predicate: Predicate, facts: FactSet) -> Evaluation:
    """Evaluate `predicate`, returning its verdict and the full leaf trace.

    Evaluation deliberately does **not** short-circuit. A partial trace would let
    a finding cite one condition while silently ignoring another that was also
    unknown, and the Gegenargument component depends on seeing every gap.
    """
    steps: list[Step] = []
    verdict = _evaluate(predicate, facts, steps)
    return Evaluation(verdict, tuple(steps))


def _evaluate(predicate: Predicate, facts: FactSet, steps: list[Step]) -> Verdict:
    match predicate:
        case Condition():
            step = _evaluate_condition(predicate, facts)
            steps.append(step)
            return step.verdict
        case All(parts):
            return kleene_and([_evaluate(p, facts, steps) for p in parts])
        case Any_(parts):
            return kleene_or([_evaluate(p, facts, steps) for p in parts])
        case Not(part):
            return kleene_not(_evaluate(part, facts, steps))


def referenced_fields(predicate: Predicate) -> frozenset[str]:
    """Every canonical field name the predicate reads."""
    match predicate:
        case Condition():
            return frozenset({predicate.field})
        case All(parts) | Any_(parts):
            names: set[str] = set()
            for part in parts:
                names |= referenced_fields(part)
            return frozenset(names)
        case Not(part):
            return referenced_fields(part)


def predicate_from_json(obj: object) -> Predicate:
    """Parse the stored JSON shape into a `Predicate`.

    Accepted forms::

        {"field": "genh1", "op": "in", "value": ["7520"]}
        {"all": [ ... ]}
        {"any": [ ... ]}
        {"not": { ... }}
    """
    node = _as_object_map(obj)
    keys = set(node.keys())

    if "all" in keys or "any" in keys:
        key = "all" if "all" in keys else "any"
        if keys != {key}:
            raise ValueError(f"{key!r} node must not carry other keys, got {sorted(keys)}")
        raw = node[key]
        if not isinstance(raw, list):
            raise ValueError(f"{key!r} must hold a list")
        items = cast("list[object]", raw)
        parts = tuple(predicate_from_json(p) for p in items)
        return All(parts) if key == "all" else Any_(parts)

    if "not" in keys:
        if keys != {"not"}:
            raise ValueError(f"'not' node must not carry other keys, got {sorted(keys)}")
        return Not(predicate_from_json(node["not"]))

    missing = {"field", "op"} - keys
    if missing:
        raise ValueError(f"condition is missing {sorted(missing)}")
    unexpected = keys - {"field", "op", "value"}
    if unexpected:
        raise ValueError(f"condition has unexpected keys {sorted(unexpected)}")
    field = node["field"]
    op = node["op"]
    if not isinstance(field, str) or not isinstance(op, str):
        raise ValueError("condition 'field' and 'op' must be strings")
    return Condition(field=field, op=op, value=node.get("value"))


def _as_object_map(obj: object) -> dict[str, object]:
    """Narrow untrusted JSON to a string-keyed mapping, rejecting anything else."""
    if not isinstance(obj, dict):
        raise ValueError(f"predicate must be an object, got {type(obj).__name__}")
    out: dict[str, object] = {}
    for key, value in cast("dict[object, object]", obj).items():
        if not isinstance(key, str):
            raise ValueError(f"predicate keys must be strings, got {type(key).__name__}")
        out[key] = value
    return out
