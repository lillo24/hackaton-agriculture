# Data Map

Status: `DRAFT` because the structures now model shared entities consistently, but they are still mock records and may shift with real API contracts.

Files
- `README.md` - folder map for the mock-data layer.
- `adminMockData.js` (`DRAFT`) - standalone azienda-side customer overview records for the `/admin` console, including varied Trentino and nearby northern Italian locations, service plans, alert volume mixes, and per-customer mock `alerts` arrays used by both the list and detail admin routes.
- `mockData.js` - centralized shared entities: `farmType` (including compact profile identity keys such as `cropType`, `soilType`, `plotBlocks`, `irrigationProfile`, `monitoringMode`), `field`, `alertSource`, `integration`, and farm-aware alert templates including provenance copy (`relevanceReasons`, `sourceContributions`) plus optional farm-specific source wiring, integrated summaries, and risk scores.
- `selectors.js` - source-of-truth selectors that derive farm-specific alerts, source-level provenance details, integrated summary text, risk scores, and linked feed context from shared entities.

Why this lives alone
- Shared domain data is intentionally centralized so route files stay presentation-focused.
- Selectors in this folder own linking logic between alerts, fields, sources, and integrations.

Non-obvious behavior
- `adminMockData.js` intentionally stays separate from farmer-facing mock entities so the `/admin` company console can evolve without coupling its filters or summary metrics to the in-app farmer routes.
- Each admin customer now owns a mock `alerts` array; the alert totals on the customer summary object are kept intentionally consistent with those detail records so the list view and `/admin/customers/:customerId` stay in sync.
- Alert templates may provide optional `sourceIdsByFarm`, `integratedSummaries`, and `riskScores`; selectors expose those directly and fall back to the standard farm copy when an override is missing.
