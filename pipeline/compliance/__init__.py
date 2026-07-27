"""Swiss climate-compliance engine.

Two modules, both pure functions over plain data:

* `predicate` — three-valued evaluation of a norm's conditions against observed
  facts, where anything unclear evaluates to ``UNKNOWN`` rather than ``FALSE``.
* `befund` — the gate that turns a norm plus facts into either a finding with all
  five contract components, or a refusal naming what stopped it.

Neither module talks to a database, a network, or a language model.
"""
