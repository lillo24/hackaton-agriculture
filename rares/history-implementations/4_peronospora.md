Update the first alert in the current repo so it becomes a Peronospora alert instead of a Freeze alert.

Goal:
- Change the first alert card/list item content
- Change the corresponding alert detail content
- Keep the existing UI structure and styling
- Only replace text/content and severity/risk data needed for this alert
- Do not redesign the page

Use this exact content for the first alert:

Severity: Critical
Time ago: 4 min ago
Title: Peronospora risk
Summary: Warm, wet canopy conditions and recent rainfall point to a strong infection window for downy mildew.
Field: Lower Terrace

Problems section:
1. Title: Canopy Sensor Network
   Body: Leaf wetness remained elevated through the night, with high humidity and mild temperatures holding the canopy in a favourable infection range.

2. Title: Weather Forecast Fusion
   Body: Recent rain, continued overnight moisture, and limited drying conditions suggest a persistent disease-pressure window across this block.

Integrated section:
- Risk line: 96% Critical risk
- Body: Prolonged canopy wetness, rainfall, and stable temperatures in the infection range all align with a likely peronospora event in this parcel.

Action to do:
- Inspect the most humid rows now. Prioritize intervention in the lower, less ventilated block and verify canopy drying conditions during the next hours.

Implementation notes:
- First check whether alerts are data-driven from src/data/mockData.js and selectors.
- If so, update only the first alert object and its related detail fields there.
- Preserve ids, routing, and existing component structure.
- If the alert detail uses separate mapped fields, update those too.
- Do not touch unrelated alerts.
- Do NOT rebuild the alerts array from scratch.
- Do not change layout, spacing, or colors except what is already driven by the alert severity.
- Keep the alert as Critical severity and make sure any existing riskScore is updated consistently to 92.
- If the list preview uses a shorter summary field than the detail page, keep both coherent.

At the end, print a short summary of:
- which file(s) were changed
- which fields were updated
- whether the first alert is fully data-driven or had any hardcoded parts