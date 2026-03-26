# Data Map

Status: `DRAFT` because the structures now model shared entities consistently, but they are still mock records and may shift with real API contracts.

Files
- `README.md` - folder map for the mock-data layer.
- `mockData.js` - centralized shared entities: `farmType`, `field`, `alertSource`, `integration`, and farm-aware alert templates including provenance copy (`relevanceReasons`, `sourceContributions`).
- `selectors.js` - source-of-truth selectors that derive farm-specific alerts, source-level provenance details, and linked feed context from shared entities.

Why this lives alone
- Shared domain data is intentionally centralized so route files stay presentation-focused.
- Selectors in this folder own linking logic between alerts, fields, sources, and integrations.
