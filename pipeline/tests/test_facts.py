from __future__ import annotations

from datetime import UTC, datetime

import pytest

from compliance.facts import Fact


def _fact(**overrides: object) -> Fact:
    base: dict[str, object] = {
        "value": "7520",
        "field": "GENH1",
        "dataset": "gwr",
        "record_id": "1234567",
        "retrieved_at": datetime(2026, 7, 27, tzinfo=UTC),
    }
    base.update(overrides)
    return Fact(**base)  # pyright: ignore[reportArgumentType]


def test_naive_timestamp_is_rejected() -> None:
    with pytest.raises(ValueError, match="timezone-aware"):
        _fact(retrieved_at=datetime(2026, 7, 27))


@pytest.mark.parametrize("missing", ["field", "dataset", "record_id"])
def test_provenance_fields_are_mandatory(missing: str) -> None:
    with pytest.raises(ValueError, match=missing):
        _fact(**{missing: ""})


def test_a_null_value_is_still_a_valid_fact() -> None:
    """ "The register holds no value" is itself an observation worth recording."""
    assert _fact(value=None).value is None


def test_fact_is_frozen() -> None:
    fact = _fact()
    with pytest.raises(AttributeError):
        fact.value = "other"  # pyright: ignore[reportAttributeAccessIssue]


def test_cite_names_dataset_field_record_and_time() -> None:
    cite = _fact().cite()
    assert "gwr.GENH1" in cite
    assert "1234567" in cite
    assert "2026-07-27" in cite
