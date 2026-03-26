# Layout Map

Status: `DRAFT` while preview-shell presentation is still being tuned and has no automated visual regression coverage.

Files
- `README.md` (`STABLE`) - folder map for shell-level files and ownership notes.
- `AppShell.jsx` (`DRAFT`) - owns shell composition, preview-mode state, mode toggle UI, four-item primary nav (`Dashboard`, `Alerts`, `Alert`, `Profile`) with icons, and wrapper selection (`PhoneFrame` vs desktop preview frame) around routed content.
- `AppShell.css` (`DRAFT`) - styles for the outer shell (toggle + preview stage), centered phone presentation, desktop preview frame, and icon+label nav behavior across phone/desktop modes.

Why these live together
- `AppShell.jsx` owns app-wide presentation structure and preview wrapper decisions.
- `AppShell.css` is tightly coupled to that structure, including mode-specific shell behavior, and should evolve with it.
