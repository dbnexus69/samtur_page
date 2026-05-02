# Samtur Page - Agent Instructions

## Commands
- `npm run dev` - Start Vite dev server
- `npm run build` - Run `tsc` typecheck, then `vite build`
- `npm run preview` - Preview production build

## Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS (configured in `tailwind.config.js`)
- React Router for routing
- Recharts for charts
- Lucide React for icons

## Architecture
- Entry: `src/main.tsx` → `src/App.tsx`
- Routes: `/login`, `/`, `/sales`, `/clients`, `/itineraries`, `/users`, `/config`
- Auth: `src/context/AuthContext.tsx` - manages login state
- Data: `src/context/DataContext.tsx` - manages mock data
- Permissions: `src/context/PermissionsContext.tsx` - role-based access
- Protected routes require authentication; `/users` and `/config` require admin role

## Key Files
- `src/pages/` - All page components
- `src/components/ui/` - Reusable UI components (Button, Card, Modal, Table, Form, Badge)
- `src/components/dashboard/` - Dashboard-specific components (KPICard, TrendChart, SalesTable, etc.)
- `src/components/layout/` - Layout, Header, Sidebar
- `src/data/mockData.ts` - Mock data source

## Notes
- Mock data is used (no real backend)
- Build order matters: `tsc` runs before `vite build`
- Spanish-language travel agency dashboard