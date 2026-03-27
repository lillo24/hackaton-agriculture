Edit only the mock data.

Work inside:
rares/app-skeleton

Goal:
Make the admin mock dataset consist only of vineyard customers for now.

Important:
- Change ONLY the mock data
- Do NOT change routes
- Do NOT change components
- Do NOT change filters logic
- Do NOT change styling
- Do NOT touch farmer-facing pages
- Keep the existing data structure exactly compatible with the current admin UI

File to edit:
- src/data/adminMockData.js

What to change:
1. Make every customer a vineyard customer
- All mock customers should now represent vineyards / wine producers only
- Set cropType consistently to vineyard-related values only, for example:
  - "Vineyard"
  - "Sparkling vineyard"
  - "Hillside vineyard"
  - "Organic vineyard"
  - "Valley-floor vineyard"
Do not use orchards, greenhouse, apples, mixed farm, etc.

2. Update the farm names so they feel vineyard-specific
Use realistic naming like:
- Tenuta Colle Grande
- Vigneti San Michele
- Podere Maso delle Viti
- Cantina Rovere Alto
- Vigna Terrazzata Mori
- Azienda Vitivinicola Adige Nord
Keep them plausible for Trentino / Alto Adige style contexts.

3. Update the alert content so it matches vineyards only
For every customer's `alerts` array:
- make alerts vineyard-relevant only
- remove orchard/apple/greenhouse language
- use vineyard-specific alert themes such as:
  - mildew pressure
  - downy mildew risk
  - powdery mildew risk
  - frost pocket cooling
  - budbreak frost risk
  - sunburn risk on exposed rows
  - canopy humidity persistence
  - leaf wetness spike
  - heat stress on south-facing slope
  - water stress in shallow-soil block
  - uneven ripening signal
  - disease-conducive wet window

4. Update field names so they sound like vineyard blocks
Examples:
- North terrace
- Lower slope rows
- South-facing block
- West canopy edge
- Parcel A terraces
- Valley-floor block
- Ridge rows
- Block 3 upper vines

5. Keep the dataset internally consistent
- Keep at least 12 customers
- Keep the current structure and keys unchanged
- Keep activeAlerts / criticalAlerts / highAlerts / mediumAlerts / lowAlerts numerically consistent with the visible alerts
- Customers with 0 alerts can remain, but should still be vineyards

6. Keep locations realistic
You can keep the realistic northern Italian / Trentino-style places already added, but make sure they fit vineyard contexts well.

Acceptance criteria:
- Only vineyard customers remain
- No orchard / apple / greenhouse references remain in mock data
- Alerts, farm names, and field names all feel vineyard-specific
- Existing admin UI still works without component changes

After editing, quickly scan the mock file for any leftover non-vineyard wording.