# Components Map

Status: `STABLE` for the current MVP because these files own small, focused UI primitives with narrow responsibilities. Remaining risk is mostly visual iteration rather than API churn.

Files
- `README.md` - folder map for reusable UI pieces.
- `PhoneFrame.jsx` - reusable visual device shell that wraps arbitrary app content.
- `PhoneFrame.css` - premium bezel, notch, reflection, and screen styling for the phone frame.
- `PageHeader.jsx` - consistent title block used by route screens.
- `SectionCard.jsx` - shared card wrapper for grouped page content.
- `StatusBadge.jsx` - tone-aware pill for severities, statuses, and metadata tags.
- `AlertListItem.jsx` - reusable prioritized alert card with field/source metadata that opens the dedicated `/alert` route while preserving list return context and focus id.
- `components.css` - shared styling rules for the reusable components above.

Why these live together
- Each file in this folder is reusable across multiple routes.
- The `PhoneFrame` owns the donor-inspired device chrome, while the other components keep page markup lean and consistent.
