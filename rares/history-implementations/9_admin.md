You are editing the existing rares repo.

Work inside:
rares/app-skeleton

Goal:
Create a NEW standalone "Admin" page for the azienda/company side.
This page must be separate from the farmer app pages and must NOT appear in the existing bottom farmer navigation.
The company should access it through a dedicated route only: /admin

Important:
- Keep the current farmer app unchanged as much as possible.
- Do not break Dashboard / Alerts / Alert / Profile.
- Do not add new dependencies.
- Use the current React + CSS style already present in the repo.
- Use mock data only.
- The “azienda-only” protection can be a MOCK frontend gate only. Make that clear in code comments if needed. Do not pretend this is real security.

What to build

1) Create a standalone admin route
- In src/App.jsx add a new route for /admin
- This route must be OUTSIDE the AppShell route tree, so it feels like a separate company console
- The existing AppShell and bottom nav must remain only for the farmer-facing app

2) Add a mock admin access gate
- On /admin, if sessionStorage key `rares_admin_access` is missing or false:
  - show a centered clean access card
  - title: "Company admin access"
  - short text explaining this is a mock company-only view
  - password/passcode input
  - button: "Enter admin"
- Accept the passcode: `azienda-demo`
- On success:
  - set sessionStorage.setItem('rares_admin_access', 'true')
  - show the admin page
- Add a small "Exit admin" button in the admin page header:
  - clears the sessionStorage flag
  - returns to the gate state
- Again: this is only mock UI gating, not real auth

3) Create mock customer/farmer data
Create a new file:
src/data/adminMockData.js

Export an array with at least 12 mock customer records.
Each record should include at minimum:
- id
- farmerName
- farmName
- locationLabel
- region
- cropType
- hectares
- parcelCount
- activeAlerts
- criticalAlerts
- highAlerts
- mediumAlerts
- lowAlerts
- lastAlertLabel
- servicePlan
- status

Make the mock records varied.
Use plausible Italian/Trentino-like locations.
Mix alert volumes so filters are useful.
Include a few customers with 0 alerts.

4) Create the admin page
Create:
src/pages/AdminPage.jsx

Admin page requirements:
- desktop-friendly, full-page layout
- clean header
- title: "Admin"
- subtitle explaining this is the azienda-side customer overview
- actions on the right:
  - Exit admin
  - optional small button/link to go back to /dashboard

Top summary stats:
- total customers
- total active alerts
- customers with critical alerts
- average alerts per customer

Filters section:
- text search input:
  - search across farmerName, farmName, locationLabel
- location dropdown:
  - “All locations” + unique locations or regions from the mock data
- alert volume dropdown:
  - All
  - 0 alerts
  - 1–2 alerts
  - 3–5 alerts
  - 6+ alerts
- sort dropdown:
  - Most alerts
  - Least alerts
  - Name A–Z

Results section:
- show result count
- show customers in a clean responsive card grid or table-like list
- each customer card should show:
  - farmerName
  - farmName
  - locationLabel
  - cropType
  - hectares and parcelCount
  - activeAlerts
  - breakdown chips for critical/high/medium/low
  - lastAlertLabel
  - servicePlan
- make customers with critical alerts visually stand out a bit, but keep it tasteful
- add an empty state if no results match the filters

5) Styling
Add CSS in:
src/pages/pages.css

Create a distinct admin style section, for example:
- .admin-shell
- .admin-access
- .admin-page
- .admin-toolbar
- .admin-stats
- .admin-grid
- .admin-customer-card
etc.

Design direction:
- cleaner, slightly more operational / company-console feel
- should still fit the rest of the product visually
- avoid excessive rounded bubbles
- use the current palette already present in the project
- good spacing and readable density
- responsive enough that it still looks acceptable on narrower widths

6) Keep code quality high
- Reuse small helper functions where useful
- Use useMemo for filtered/sorted results
- Keep data logic simple and readable
- No dead code
- No fake backend calls

7) Acceptance criteria
- Visiting /admin shows the mock access gate
- Entering `azienda-demo` unlocks the admin page
- Admin page is separate from the farmer app shell
- Existing bottom navigation does not show Admin
- Search by name works
- Filter by land/location works
- Filter by number of alerts works
- Mock people/customers are included
- Empty state works
- Existing farmer routes still work

Files expected to change/add
- src/App.jsx
- src/pages/AdminPage.jsx
- src/data/adminMockData.js
- src/pages/pages.css

After editing, quickly sanity-check for import errors and JSX mistakes.