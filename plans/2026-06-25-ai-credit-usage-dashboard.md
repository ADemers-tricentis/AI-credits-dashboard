# Plan: AI Credit Usage Reporting Dashboard

**Date:** 2026-06-25
**Status:** Ready for execution

---

## Overview

Scaffold a React + TypeScript + Vite app (pnpm) for the AI Credit Usage Reporting dashboard defined in the PRD at `https://tricentis.atlassian.net/wiki/x/EYDlxg`. All UI uses components from `@tricentis/aura` (local build at `../Tricentis/aura-ui`) and its underlying MUI v7 primitives. No other UI libraries.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Bundler | Vite 6 (react-ts template) |
| Package manager | pnpm |
| UI framework | MUI v7 (`@mui/material`) |
| Design system | `@tricentis/aura` (local file dep) |
| Icons | `@tricentis/mui-icons` |
| Styling | Emotion (`@emotion/react`, `@emotion/styled`) |
| Routing | `react-router-dom` v7 |
| State | React context (no Redux needed for prototype) |
| Charts | Hand-rolled SVG / MUI LinearProgress (no external chart lib) |
| Font | Inter via `@fontsource/inter` |

---

## Dependency Installation

```bash
# Inside /Users/a.demers/dev/ai-credit-usage
pnpm create vite . --template react-ts   # init (skip if already done)

pnpm add \
  @mui/material \
  @emotion/react \
  @emotion/styled \
  @base-ui/react \
  @tricentis/mui-icons \
  react-router-dom \
  @fontsource/inter \
  file:../Tricentis/aura-ui

pnpm add -D @types/react @types/react-dom
```

`@mui/x-data-grid-pro`, `@mui/x-date-pickers-pro`, and `@mui/x-tree-view-pro` are optional peer deps of aura — **not needed** for this project (we use MUI Table instead of DataGrid, no date pickers beyond MUI TextField type="date").

---

## File Structure

```
src/
  main.tsx                   # entry — ThemeProvider + Router + AppContext
  App.tsx                    # route definitions
  theme.ts                   # extendTheme(themeOptions) + ScopedCssBaseline
  types/
    index.ts                 # all TypeScript types
  data/
    mock.ts                  # all mock data (tenants, products, projects, users, events)
  context/
    AppContext.tsx            # current role + active date range
  layouts/
    AppLayout.tsx            # NavRail + Page wrapper + RoleSwitcher header
  components/
    RoleSwitcher.tsx         # toggle between Admin / Project Lead / IC (demo)
    DateRangeFilter.tsx      # day/week/month/custom ToggleButtonGroup
    ProductBucketCard.tsx    # single product card (credits used/budget/status badge)
    BurnRateCard.tsx         # burn-rate forecast with window selector + SVG timeline
    TopProjectsLeaderboard.tsx  # ranked list of top-7 projects (admin)
    UserRankingTable.tsx     # per-user credit ranking within a project
    ICAttributionTable.tsx   # "My Credits by Product & Project" (IC view)
    BudgetAllocationDrawer.tsx  # set per-product limits + reallocate
    AlertsConfigPanel.tsx    # per-product alert threshold config
    AlertsFeed.tsx           # NotificationItem list for in-app alerts
    CSVExportButton.tsx      # admin-only CSV download
    SearchFilters.tsx        # project name + user name filter inputs
    ChatAgentPanel.tsx       # role-scoped chat agent drawer
    BurnRateSVG.tsx          # simple SVG bar showing consumption vs renewal date
  pages/
    admin/
      AdminDashboardPage.tsx    # tenant overview → product cards + top projects + burn rate
      AdminProductPage.tsx      # single product → projects list + budget card
      AdminProjectPage.tsx      # single project → user ranking + per-user details
      AdminBudgetPage.tsx       # budget allocation UI (set limits, reallocate reserve)
    lead/
      LeadDashboardPage.tsx     # project lead home → own project + burn rate
      LeadProjectPage.tsx       # project detail → user breakdown
    ic/
      ICDashboardPage.tsx       # IC home → "My Credits" attribution table + burn rate
```

---

## Key Types (`src/types/index.ts`)

```ts
export type Role = 'admin' | 'lead' | 'ic';

export type ProductId = 'qtest' | 'neoload' | 'tosca' | 'aiworkspace';

export type Product = {
  id: ProductId;
  name: string;
  budget: number;       // credits allocated
  used: number;         // credits consumed in period
  alertThreshold: number; // 0-1 (default 0.8)
};

export type Project = {
  id: string;
  name: string;
  productId: ProductId;
  members: User[];
  creditsUsed: number;
  budget: number;       // project-level budget (subset of product)
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  projectIds: string[]; // projects this user belongs to
};

export type CreditEvent = {
  userId: string;
  projectId: string;
  productId: ProductId;
  agentId: string;
  credits: number;
  timestamp: string;   // ISO
};

export type Alert = {
  id: string;
  productId: ProductId;
  projectId?: string;
  message: string;
  threshold: number;
  triggeredAt: string;
  isRead: boolean;
};

export type DateRange = 'day' | 'week' | 'month' | 'custom';
export type BurnRateWindow = '7d' | '30d' | 'billing';

export type Tenant = {
  id: string;
  name: string;
  totalCredits: number;
  renewalDate: string;   // ISO date (e.g. "2027-03-31")
  products: Product[];
};
```

---

## Mock Data (`src/data/mock.ts`)

Construct realistic data for:
- 1 tenant: "Tricentis Demo Corp", 20,000 total credits, renewal 2027-03-31
- 4 products with varied utilization:
  - qTest/ATC: budget 5,000, used 3,800 (76%) → warning
  - NeoLoad: budget 4,000, used 1,680 (42%) → healthy
  - Tosca: budget 6,000, used 5,520 (92%) → critical
  - AI Workspace: budget 5,000, used 4,350 (87%) → critical
- 12 projects (3 per product), each with 3-6 members
- 20 users total, some shared across products
- ~200 credit events spanning 90 days
- 4 alerts (2 read, 2 unread)
- Burn rate arrays: 90-day daily totals per product (used to calculate rolling avg)

---

## Routing (`src/App.tsx`)

```
/                          → redirect to /admin or /lead or /ic based on role
/admin                     → AdminDashboardPage
/admin/products/:productId → AdminProductPage
/admin/projects/:projectId → AdminProjectPage
/admin/budget              → AdminBudgetPage
/lead                      → LeadDashboardPage
/lead/project/:projectId   → LeadProjectPage
/ic                        → ICDashboardPage
```

Role-based guards: `<RoleGuard role="admin">` redirects non-admins to their home.

---

## Theme Setup (`src/main.tsx` + `src/theme.ts`)

```tsx
// src/theme.ts
import { extendTheme } from '@mui/material/styles';
import themeOptions from '@tricentis/aura/constants/themeOptions.js';
export const theme = extendTheme(themeOptions);

// src/main.tsx
import '@fontsource/inter/variable.css';
import { ThemeProvider } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import { theme } from './theme';

root.render(
  <ThemeProvider theme={theme}>
    <ScopedCssBaseline>
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    </ScopedCssBaseline>
  </ThemeProvider>
);
```

---

## AppLayout (`src/layouts/AppLayout.tsx`)

- Outer `Box` with `display: flex`, full viewport height
- Left: `NavRail` from `@tricentis/aura/components/NavRail.js`
  - Nav items vary by role (admin sees Budget + Alerts, lead sees just Projects, IC sees just My Credits)
  - Icons from `@tricentis/mui-icons`
- Top: MUI `AppBar` containing:
  - `Brand` / `BrandMark` from aura (Tricentis logo)
  - Spacer
  - `RoleSwitcher` (MUI `ButtonGroup` or `ToggleButtonGroup`)
  - `NotificationCenterWrapper` from aura (alert bell)
- Right/main: `Page` from `@tricentis/aura/components/Page.js` wrapping `<Outlet />`

---

## AdminDashboardPage

**Sections:**
1. **Header:** MUI `Typography` h5 "AI Credit Usage" + `DateRangeFilter` (ToggleButtonGroup: Day/Week/Month + date pickers for custom)
2. **Tenant Burn-Rate Card:** `BurnRateCard` at tenant level
   - Primary: "On track through renewal" OR "At risk - projected to exhaust X months before renewal" (`ChipStatus` repurposed as badge OR MUI `Chip`)
   - Window selector: `Tag` chip group or MUI `ToggleButtonGroup` (7d / 30d / Billing Period)
   - Secondary: estimated depletion date
   - `BurnRateSVG`: horizontal bar showing consumed vs. projected vs. renewal date
3. **Product Bucket Cards:** 4× `ProductBucketCard` in MUI `Grid`
   - `DefaultContentLayout` wrapper
   - Product mark icon from aura (e.g. `ProductMarkQTest`)
   - Budget/used/remaining in MUI `Typography`
   - Utilization `LinearProgress` (color=error/warning/success)
   - Status `Tag` ("Healthy"/"Warning"/"Critical") colored with MUI palette
   - "View Projects" link navigates to `/admin/products/:id`
4. **Top Projects Leaderboard:** `TopProjectsLeaderboard`
   - MUI `List` of top-7 projects
   - Each row: project name, product `Tag`, credits bar (MUI `LinearProgress`), credits number
   - Clickable → navigate to `/admin/projects/:id`
5. **Alerts Feed:** `AlertsFeed`
   - `NotificationItem` from aura for each alert
   - Unread items highlighted
6. **CSV Export:** `CSVExportButton` (admin-only, MUI `Button` with download icon)

---

## AdminProductPage (`/admin/products/:productId`)

- MUI `Breadcrumbs` with `BreadcrumbsItem` components (Dashboard → Product)
- `ProductBucketCard` at top (same card, larger)
- `BurnRateCard` for this product
- `SearchFilters` (Filter by project + Filter by user inputs)
- MUI `Table` / list of projects for this product
  - Columns: Project Name, Members, Credits Used, Budget, Utilization bar, Status
  - Clickable rows → `/admin/projects/:id`

---

## AdminProjectPage (`/admin/projects/:projectId`)

- MUI `Breadcrumbs`: Dashboard → Product → Project
- Project burn-rate card
- `UserRankingTable`: MUI `Table` of project members
  - Columns: Rank, User, Credits Used, % of Project Total, vs. Project Avg (delta badge)
  - Search members input (`TextFieldCollapsible` from aura)
- Per-user vs. average: inline colored `Tag` ("+45% above avg" in warning color)

---

## AdminBudgetPage (`/admin/budget`)

- Tenant total credits display (contracted amount, allocated, reserve)
- Per-product allocation form:
  - Each product: `NumberField` from aura for budget input
  - Inline remaining/reserve calc
- Reallocate section: from/to product selects + amount field + "Transfer" button
- MUI `Alert` for validation (cannot exceed tenant total, cannot go below current usage)
- Save triggers mock state update + shows MUI `Snackbar` confirmation

---

## LeadDashboardPage

- Filtered to the current user's project(s) only
- Same structure as AdminDashboardPage but:
  - No tenant-wide section
  - Product cards: only the lead's products
  - `BurnRateCard` scoped to their project
  - `UserRankingTable` for their project members
  - No Budget or Alerts config (read-only alert feed)

---

## ICDashboardPage

- `ICAttributionTable`: MUI `Table`
  - Columns: Product, Project, Credits Used, Request Count, % of Project Budget
  - Totals row
- Personal burn-rate card ("Your credits last X days at current pace")
- Chat agent panel accessible via FAB or drawer

---

## BurnRateCard Component

Props: `level` ('tenant'|'product'|'project'|'user'), `used`, `budget`, `renewalDate`, `window`, `onWindowChange`

1. **Renewal health chip:** 
   - Uses MUI `Chip` color="success"/"warning"/"error" 
   - Text: "On track through renewal" | "At risk - projected to exhaust {N} months before renewal"
   - Logic: project daily burn rate × days to renewal > remaining credits → "At risk"
2. **Window selector:** MUI `ToggleButtonGroup` (7d / 30d / Billing Period)
3. **`BurnRateSVG`:** SVG 100% width, ~60px tall
   - Background bar: full width = renewal date
   - Green fill: consumed so far
   - Dashed projection line: from today to estimated exhaustion
   - Vertical marker: today
   - Red dotted line: renewal date
   - Labels: "Today", "Est. Exhaustion", "Renewal"
4. **Learning period disclaimer:** if `<7` days of data, show MUI `Alert` severity="info" instead of countdown

---

## ChatAgentPanel Component

- MUI `Drawer` anchor="right", 400px width
- `DrawerContainer` / `DrawerHeader` / `DrawerContent` / `DrawerActions` from aura
- Message thread: MUI `List` of chat bubbles (user vs. agent styled with `Box` sx)
- Input: MUI `TextField` + Send `IconButton`
- Role-scoped canned responses (mock):
  - Admin: can ask about any product/project/user
  - Lead: can ask about their project only
  - IC: can ask about their own usage
- Triggered queries: "credits used this period", "days remaining", "who is my top consumer", "am I on track for renewal"
- Responses include renewal-health framing consistent with dashboard

---

## CSVExport

Admin-only. Generates a synthetic CSV with columns: `user_id, timestamp, credits, agent_id, product_id, project_id` from mock event data. Uses browser `Blob` + `URL.createObjectURL` — no library needed.

---

## Implementation Sequence

### Step 1 - Scaffold & install
1. Run `pnpm create vite . --template react-ts` in `/Users/a.demers/dev/ai-credit-usage`
2. Install all dependencies (see Dependency Installation above)
3. Delete boilerplate (`src/App.css`, `src/index.css` placeholder styles, `public/vite.svg`, `src/assets/react.svg`)
4. Create `src/types/index.ts` with all types
5. Create `src/data/mock.ts` with full mock dataset

### Step 2 - Theme & providers
6. Create `src/theme.ts`
7. Update `src/main.tsx` with ThemeProvider + ScopedCssBaseline + Inter font import
8. Create `src/context/AppContext.tsx` (role, dateRange, burnRateWindow state)

### Step 3 - Layout
9. Create `src/layouts/AppLayout.tsx` with NavRail + AppBar + Page
10. Create `src/components/RoleSwitcher.tsx`
11. Create `src/App.tsx` with all routes
12. Verify app renders with role switcher visible

### Step 4 - Shared components
13. `DateRangeFilter.tsx`
14. `ProductBucketCard.tsx`
15. `BurnRateSVG.tsx`
16. `BurnRateCard.tsx`
17. `TopProjectsLeaderboard.tsx`
18. `UserRankingTable.tsx`
19. `ICAttributionTable.tsx`
20. `SearchFilters.tsx`
21. `AlertsFeed.tsx`
22. `CSVExportButton.tsx`
23. `ChatAgentPanel.tsx` (Drawer + mock responses)
24. `BudgetAllocationDrawer.tsx`

### Step 5 - Pages
25. `AdminDashboardPage.tsx`
26. `AdminProductPage.tsx`
27. `AdminProjectPage.tsx`
28. `AdminBudgetPage.tsx`
29. `LeadDashboardPage.tsx`
30. `LeadProjectPage.tsx`
31. `ICDashboardPage.tsx`

### Step 6 - Polish
32. Role-based redirect from `/` based on active role
33. Active nav item tracking in NavRail
34. Alerts count badge on notification bell
35. Mobile-responsive check (MUI Grid breakpoints)
36. Run `pnpm tsc --noEmit` and fix all type errors

---

## Aura Component Usage Map

| Aura Component | Used In |
|---|---|
| `NavRail` | AppLayout |
| `Page` | AppLayout |
| `DefaultContentLayout` | ProductBucketCard, BurnRateCard |
| `Brand` / `BrandMark` | AppLayout header |
| `BreadcrumbsItem` | AdminProductPage, AdminProjectPage |
| `ChipStatus` | AlertsFeed (status of alerts) |
| `ChipSubtle` | UserRankingTable (rank badge) |
| `Tag` | ProductBucketCard (status), TopProjectsLeaderboard (product label) |
| `Tooltip` | CSVExportButton, any disabled actions |
| `NotificationItem` | AlertsFeed |
| `NotificationCenterWrapper` | AppLayout (alert bell) |
| `DrawerContainer` / `DrawerHeader` / `DrawerContent` / `DrawerActions` | ChatAgentPanel, BudgetAllocationDrawer |
| `DrawerCloser` | ChatAgentPanel, BudgetAllocationDrawer |
| `ZeroState` + `GraphicsZeroStateBackground` | Empty search results |
| `TextFieldCollapsible` | Project member search in AdminProjectPage |
| `NumberField` | Budget input in AdminBudgetPage |
| `ProductMarkQTest` / `ProductMarkNeoload` / `ProductMarkTosca` | ProductBucketCard icons |
| `ProductIconMarkDataIntegrity` | AI Workspace bucket (closest match) |
| `IconArtificialIntelligenceOutlined` | Chat agent panel icon |
| `IconUploadOutlined` | CSV export button |
| `IconTricentisCopilot` | Chat agent header |

---

## Notes & Constraints

- **No MUI X Pro**: Use MUI `Table` instead of DataGrid (avoids license key requirement)
- **No recharts/chart.js**: Use SVG + MUI `LinearProgress` for all data viz
- **No external date library**: Use native `Date` + `Intl.DateTimeFormat` for formatting
- **AI Workspace teams vs. projects**: In mock data, treat AI Workspace "teams" as projects with a `isTeam: true` flag; add a UI note in AdminProductPage for AI Workspace
- **Learning period**: Show disclaimer when user has <7 days of data in selected window
- **RBAC**: Enforced client-side via AppContext role; all data filtered in component
- **CSV**: Admin-only button, hidden (not just disabled) for non-admin roles
