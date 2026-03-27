In the `rares/app-skeleton` repo, update the alerts page so it uses a **History** toggle instead of the current **Farm relevance** filter.

Reference behavior:
- Use the uploaded `AlertsPage.jsx` as the source of truth for the History-toggle logic.
- Keep the current `rares` structure and styling as much as possible.
- Do NOT redesign the page.
- Do NOT touch unrelated pages.

Goal:
Replace the third filter ("Farm relevance") with a toggle button called "History".
When enabled, historical alerts should be included in the feed.
When disabled, only live alerts should be shown.

Make these changes in `src/pages/AlertsPage.jsx`:

1. Remove `farmRelevanceScale` from the import:
- change
  `import { alertSeverityScale, farmRelevanceScale } from '../data/mockData';`
- to
  `import { alertSeverityScale } from '../data/mockData';`

2. Remove all farm-relevance filter logic:
- delete `const relevanceFilter = ...`
- delete `const hasActiveFilters = [severityFilter, sourceFilter, relevanceFilter]...`
- remove the `relevanceFilter` condition inside `filteredAlerts`
- remove `relevanceFilter` from the `useMemo` dependency list
- remove the whole `<label ...>Farm relevance</label>` block from the filter UI

3. Add the History toggle behavior from the uploaded source file:
- add a local `historyAlerts` array with one resolved historical alert:
  - id: `history-irrigation-drift-archived`
  - severity: `low`
  - status: `resolved`
  - title: `Irrigation drift stabilized after valve calibration`
  - summary: `Archived signal from the previous cycle. Moisture variance recovered inside the expected range.`
  - sourceIds: `['soil-probe-grid', 'weather-model']`
  - sourceNames: `['Soil Probe Grid', 'Weather Forecast Fusion']`
  - timestampLabel: `3 days ago`
  - isHistorical: `true`

4. Read history state from query params:
- add
  `const historyEnabled = searchParams.get('history') === '1';`

5. Update `filteredAlerts` so:
- it still applies severity and source filters to live alerts
- when `historyEnabled` is false, return only those live alerts
- when `historyEnabled` is true, also append filtered `historyAlerts`

6. Add a `toggleHistory()` function:
- use `URLSearchParams(searchParams)`
- remove old `status` and `relevance` params if present
- if currently enabled, delete `history`
- else set `history=1`
- call `setSearchParams(nextSearch, { replace: true })`

7. Update `updateFilter()` so it also deletes stale `relevance` params:
- after deleting `status`, also delete `relevance`

8. Replace the third filter control in the JSX with a toggle button:
- structure:
  - wrapper class: `filter-field filter-field--toggle`
  - label text: `History`
  - button class: `filter-toggle` plus `is-active` when enabled
  - `aria-pressed={historyEnabled}`
  - text inside button: `History`

9. Keep the existing `Clear filters` button behavior, but make it depend only on real active filters:
- compute active filters only from severity and source
- do NOT count history as a "clear filters" state
- example:
  `const hasActiveFilters = [severityFilter, sourceFilter].some((value) => value !== 'all');`

10. Keep the current `rares` alert grouping and "No high-priority alerts" card.
Do not revert other `rares` behavior.
Only replace farm relevance with history.

11. Historical items should render with the same existing `AlertListItem` component.
Passing `isHistorical` is allowed even if the component ignores it.

12. After editing, verify:
- no remaining `farmRelevanceScale` import
- no remaining `relevanceFilter`
- the alerts page builds without lint/runtime errors
- query params work like:
  - `/alerts?history=1`
  - `/alerts?severity=high&history=1`
  - `/alerts?source=weather-model`

Finally, show me the exact diff for `src/pages/AlertsPage.jsx`.