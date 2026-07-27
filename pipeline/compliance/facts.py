"""Observed facts, inseparable from their provenance.

A compliance finding is an allegation that a named public authority is acting
unlawfully. The evidential chain behind such an allegation is not optional
metadata — it is the thing that makes it defensible. So provenance is carried by
the value type itself: there is no way to hand a bare value to the evaluator, and
therefore no way to reach a verdict that cannot be traced back to a dataset, a
record and a retrieval time.

The timezone-aware enforcement mirrors `ProvenanceEntry` in the sibling
openclimatelaw project: a naive timestamp cannot be compared across sources, and
a provenance record you cannot compare is not a provenance record.
"""

from __future__ import annotations

from collections.abc import Mapping
from dataclasses import dataclass
from datetime import datetime

__all__ = ["Fact", "FactSet"]


@dataclass(frozen=True, slots=True)
class Fact:
    """One observed value together with where it came from.

    `field` is the *upstream* name (``GENH1``), which is what a Subsumtion has to
    quote; the key under which the fact is filed in a `FactSet` is the canonical
    name a predicate refers to (``heating_energy_source``). Keeping both means a
    finding can say "GWR field GENH1 on EGID 1234567, retrieved 2026-07-27"
    without the predicate author having to know GWR's naming.
    """

    value: object
    field: str
    dataset: str
    record_id: str
    retrieved_at: datetime

    def __post_init__(self) -> None:
        if not self.field:
            raise ValueError("Fact.field must name the upstream field")
        if not self.dataset:
            raise ValueError("Fact.dataset must name the source dataset")
        if not self.record_id:
            raise ValueError("Fact.record_id must identify the upstream record")
        tz = self.retrieved_at.tzinfo
        if tz is None or tz.utcoffset(self.retrieved_at) is None:
            raise ValueError(
                "Fact.retrieved_at must be timezone-aware; "
                "a naive timestamp cannot be compared across sources"
            )

    def cite(self) -> str:
        """A one-line source reference for use in a Subsumtion."""
        return (
            f"{self.dataset}.{self.field}={self.value!r} "
            f"(record {self.record_id}, retrieved {self.retrieved_at.isoformat()})"
        )


# Keyed by the canonical field name that predicates refer to.
FactSet = Mapping[str, Fact]
