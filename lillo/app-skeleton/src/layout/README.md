# Layout Map

Status: `DRAFT` while preview-shell presentation is still being tuned and has no automated visual regression coverage.

Files
- `README.md` (`STABLE`) - folder map for shell-level files and ownership notes.
- `AppShell.jsx` (`DRAFT`) - owns shell composition, preview-mode state, mode toggle UI, two-step app nav (`Profile`, `Alerts`), and wrapper selection (`PhoneFrame` vs desktop preview frame) around the routed app content.
- `AppShell.css` (`DRAFT`) - styles for the minimal outer shell (toggle + preview stage), centered phone presentation, full-surface desktop preview frame, and shared app-surface adjustments.

Why these live together
- `AppShell.jsx` owns app-wide presentation structure and preview wrapper decisions.
- `AppShell.css` is tightly coupled to that structure, including mode-specific shell behavior, and should evolve with it.
