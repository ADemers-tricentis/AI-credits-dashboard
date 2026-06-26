# AI Credit Usage Dashboard

Internal dashboard for tracking and managing AI credit consumption across teams and projects at Tricentis.

## Features

Three role-based views with tailored data:

- **Admin** - org-wide usage by product, project, and team; budget allocation and burn rate
- **Team Lead** - project-level breakdown and IC attribution for their team
- **IC (Individual Contributor)** - personal usage summary and rankings

## Tech Stack

- React 18 + TypeScript
- Vite
- MUI v7 + Tricentis Aura design system
- React Router v7

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173. Use the role switcher in the top nav to toggle between Admin, Lead, and IC views.

## Build

```bash
pnpm build      # type-check + bundle to dist/
pnpm preview    # serve the dist/ build locally
```

## Notes

- Data is currently mocked in `src/data/mock.ts`
- Aura UI is resolved from a local sibling directory (`../Tricentis/aura-ui`)
