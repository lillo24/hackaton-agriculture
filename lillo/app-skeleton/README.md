# App Skeleton Map

Status: `DRAFT` because the visual MVP is implemented, but it still needs dependency installation and automated test coverage.

Files and folders
- `README.md` - folder map for this runnable app package.
- `package.json` - project manifest for the standalone Vite React app.
- `package-lock.json` - npm lockfile captured after dependency installation for reproducible installs.
- `vite.config.js` - Vite configuration for the React build.
- `index.html` - browser entry document for the app.
- `src/` - application code, mock data, page modules, layout, and reusable components.

Why these live together
- This folder is the runnable implementation for the `01_app_skeleton.md` and `prompt_extract_phone_frame.txt` briefs.
- The app stays isolated under `lillo/` so the donor repo remains a read-only reference.

Non-obvious behavior
- The app defaults to the `Vineyard` profile on first load so every route has meaningful mock content before a manual selection is made.
- The `PhoneFrame` is the primary preview container; the desktop text column is supporting presentation context only.
