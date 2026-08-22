# Open Gov Climate

[Riverflow](https://opengovclimate.ch/riverflow/) is the current primary project of Open Gov Climate. It makes the Swiss water cycle legible from source data to legal protection: live river measurements, water quality, reservoirs, glaciers, groundwater, wetlands, water use and the statutory duties attached to them.

Riverflow is open and collaborative. Contributions from science, law, public authorities, civic technology and people with local knowledge are invited in the [Riverflow repository](https://github.com/jonashertner/riverflow-ch).

The previous environmental-evidence concept is preserved at `/archive/` for later revision. It remains non-indexed and behind its existing preview gate.

## Local development

```sh
npm ci
npm run dev
```

`npm run build` creates the static publication, search index and runs the publication contract. Deployment then adds the independently verified Riverflow build at `/riverflow/`.
