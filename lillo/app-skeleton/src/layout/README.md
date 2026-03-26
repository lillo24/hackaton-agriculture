# Layout Map

Status: `DRAFT` while preview-shell presentation is still being tuned and has no automated visual regression coverage.

Files
- `README.md` (`STABLE`) - folder map for shell-level files and ownership notes.
- `AppShell.jsx` (`DRAFT`) - owns shell composition, preview-mode state, mode toggle UI, four-item primary nav (`Dashboard`, `Alerts`, `Alert`, `Profile`) with icons, and stage wrapper selection (`PhoneFrame`, desktop preview frame, or Roadmap presentation mode).
- `AppShell.css` (`DRAFT`) - styles for the outer shell (toggle + preview stage), including roadmap-specific toggle docking/shrinking transition and presentation-canvas stage treatment.
- `RoadmapPresentation.jsx` (`DRAFT`) - dedicated presentation-mode slideshow rendered only in `Roadmap` mode; owns step state, click/keyboard progression, and staged Marketing -> Costi narrative.
- `RoadmapPresentation.css` (`DRAFT`) - visual system, hierarchy, and reveal animations for the roadmap slideshow, network story sequence, and cost pillars.

Why these live together
- `AppShell.jsx` owns app-wide presentation structure and preview wrapper decisions.
- `RoadmapPresentation` is a shell-level view, not a route page, so it stays with shell ownership and mode toggling.
- `AppShell.css` and `RoadmapPresentation.css` are tightly coupled to stage behavior and should evolve with their paired components.

Non-obvious behavior
- `Roadmap` mode intentionally bypasses both phone and desktop app wrappers: routed `Outlet` content is not rendered in that mode.
- `RoadmapPresentation` advances by stage click/tap, keyboard (`ArrowLeft`, `ArrowRight`, `Enter`, `Space`), or next/previous controls; all reveal logic is driven by a local step state.
- When `Roadmap` is active, the top mode toggle intentionally docks left and scales down to make the stage feel presentation-first; it restores centered/full size when leaving roadmap mode.
