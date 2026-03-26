# Src Map

Status: `DRAFT` because the source tree is stable enough to demo, but the interfaces may still move while the MVP evolves.

Files and folders
- `README.md` - folder map for the source tree.
- `main.jsx` - browser bootstrap that mounts the React app inside `BrowserRouter`.
- `App.jsx` - top-level route wiring, selected-farm state owner, and farm-switch loading placeholder trigger.
- `index.css` - global theme tokens, background system, and shared browser resets.
- `components/` - reusable visual building blocks such as badges, cards, and the phone frame.
- `layout/` - desktop stage plus mobile-app shell that wraps routed page content.
- `pages/` - route-level screens for farm selection, alerts, and alert detail.
- `data/` - centralized shared entities plus selectors for farm-aware alert derivation and in-detail provenance rendering.

Why these live together
- `App.jsx` coordinates the folders below it.
- The rest of the folders divide responsibility by reuse level: global bootstrapping, reusable UI pieces, shell layout, route screens, and mock domain data.

Non-obvious behavior
- The app intentionally exposes only the profile -> alerts -> alert detail flow; unknown routes are redirected to `/farm-type`.
