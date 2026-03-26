# Layout Map

Status: `DRAFT` while preview-shell presentation is still being tuned and has no automated visual regression coverage.

Files
- `README.md` (`STABLE`) - folder map for shell-level files and ownership notes.
- `AppShell.jsx` (`DRAFT`) - owns shell composition, preview-mode state, mode toggle UI, four-item primary nav (`Dashboard`, `Alerts`, `Alert`, `Profile`) with icons, and stage wrapper selection (`PhoneFrame`, desktop preview frame, or Roadmap presentation mode).
- `AppShell.css` (`DRAFT`) - styles for the outer shell (toggle + preview stage), including roadmap-specific toggle docking/shrinking transition and presentation-canvas stage treatment.
- `RoadmapPresentation.jsx` (`DRAFT`) - dedicated presentation-mode canvas rendered only in `Roadmap` mode; owns step state, click/keyboard progression, animated Company -> Consorzio -> many farmers sequence, and final visual cost/time overlay step.
- `RoadmapPresentation.css` (`DRAFT`) - full-bleed roadmap canvas styling plus node/line reveal animations, floating arrow controls, and compact cost/time panel visuals.

Why these live together
- `AppShell.jsx` owns app-wide presentation structure and preview wrapper decisions.
- `RoadmapPresentation` is a shell-level view, not a route page, so it stays with shell ownership and mode toggling.
- `AppShell.css` and `RoadmapPresentation.css` are tightly coupled to stage behavior and should evolve with their paired components.

Non-obvious behavior
- `Roadmap` mode intentionally bypasses both phone and desktop app wrappers: routed `Outlet` content is not rendered in that mode.
- `RoadmapPresentation` advances by stage click/tap, keyboard (`ArrowLeft`, `ArrowRight`, `Enter`, `Space`), or floating arrow controls; all reveal logic is driven by a local step state.
- `RoadmapPresentation` measures the rendered positions of Company, Consorzio, and farmer nodes to draw connector paths, so the network stays aligned after resize and in full-screen desktop presentation mode.
- In `Roadmap` mode, the shell switches to a single full-bleed stage with no outer container; the preview-mode toggle becomes fixed/overlayed at the top-left and does not consume layout space.
- Final roadmap step overlays a compact visual estimate panel (`time + cost`) inside the same canvas, while dimming the network layer to keep focus on costs.
